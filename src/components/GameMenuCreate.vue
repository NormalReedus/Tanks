<template>
  <div class="create-menu">
    <section class="add-player">
      <input
        class="add-player__name-input"
        v-model="selectedName"
        type="text"
        placeholder="Player Name"
        minlength="1"
        maxlength="10"
        spellcheck="false"
      />

      <div class="controls">
        <p class="controls__p--warning" v-if="controlsWarning">
          <kbd>CTRL</kbd> +
          <kbd>W</kbd> cannot be used!
        </p>
        <keybinding-input ref="fireInput" v-model="selectedControls.fire" :placeholder="'Fire'"></keybinding-input>
        <keybinding-input
          ref="forwardInput"
          v-model="selectedControls.forward"
          :placeholder="'Forward'"
        ></keybinding-input>
        <keybinding-input
          ref="backwardInput"
          v-model="selectedControls.backward"
          :placeholder="'Backward'"
        ></keybinding-input>
        <keybinding-input
          ref="leftInput"
          v-model="selectedControls.left"
          :placeholder="'Turn Left'"
        ></keybinding-input>
        <keybinding-input
          ref="rightInput"
          v-model="selectedControls.right"
          :placeholder="'Turn Right'"
        ></keybinding-input>
      </div>

      <button class="add-player__color-input" @click="selectColor($event)">
        <inline-svg :src="require('@/assets/color-tank.svg')" :transformSource="setInitialColor"></inline-svg>
        <!-- require-syntax is required to use inline-svg -->
      </button>

      <button class="add-player__add-button" @click="addPlayer">
        <img src="@/assets/icons/add-player.svg" /> Add Player
      </button>
    </section>

    <section class="start">
      <button class="start__settings-button" @click="openConfig">
        <img src="@/assets/icons/settings.svg" /> Settings
      </button>
      <div class="titles">
        <h1 class="titles__title">Tanks</h1>
        <h2 class="titles__subtitle">Try Not To Kill Yourself</h2>
      </div>
      <button class="start__start-button" @click="startGame">Start Game</button>
    </section>

    <color-picker
      id="createMenuColorPicker"
      :selected-color="selectedColor"
      @color="setColor($event)"
      @hide="hideColorPicker"
      :style="colorPickerRendering"
      :pointer-events="colorPickerPointerEvents"
    />
  </div>
</template>

<script>
import InlineSvg from 'vue-inline-svg'
import ColorPicker from './GameMenuColorPicker.vue'
import KeybindingInput from './GameMenuCreateKeybindingInput.vue'

import game from '@/game/game.js'
import Player from '@/game/Player.js'
import Controls from '@/game/Controls.js'

export default {
	name: 'GameMenuCreate',
	components: {
		InlineSvg,
		ColorPicker,
		KeybindingInput,
	},

	data() {
		return {
			selectedName: '',
			selectedColor: this.randomizeColor(),
			selectedControls: {
				fire: '',
				forward: '',
				backward: '',
				left: '',
				right: '',
			},

			colorPickerShow: 'none',
			colorPickerPointerEvents: false,
			colorPickerCoords: {
				x: 0,
				y: 0,
			},
		}
	},

	computed: {
		colorPickerRendering() {
			return {
				'--top': this.colorPickerCoords.y + 'px',
				'--left': this.colorPickerCoords.x + 'px',
				'--show': this.colorPickerShow,
			}
		},

		controlsWarning() {
			const vals = Object.values(this.selectedControls)
			return vals.includes(17) && vals.includes(87) // True if CTRL & W are chosen
		},
	},

	methods: {
		addPlayer() {
			const name = this.selectedName
			const color = this.selectedColor
			const fire = this.selectedControls.fire
			const forward = this.selectedControls.forward
			const backward = this.selectedControls.backward
			const left = this.selectedControls.left
			const right = this.selectedControls.right

			// Everything must be filled out:
			if (!(name && color && fire && forward && backward && left && right))
				return console.log('Fill out everything')
			//TODO: Add message to fill out everything

			game.addPlayer(
				new Player(
					name,
					color,
					new Controls(forward, backward, left, right, fire)
				)
			)

			this.resetInputs()
		},

		startGame() {
			game.new()
		},

		selectColor(event) {
			// Only clicks on relevant parts of svg:
			if (!event.target.classList.contains('select-color-input')) return

			this.colorPickerCoords = {
				x: event.layerX, // Uses layer, not page, since colorPicker is absolutely positioned
				y: event.layerY,
			}

			this.colorPickerShow = 'flex'
			this.colorPickerPointerEvents = true
		},

		randomizeColor() {
			return [
				Math.floor(Math.random() * 256),
				Math.floor(Math.random() * 256),
				Math.floor(Math.random() * 256),
			]
		},

		// Used by inline-svg:
		setInitialColor(svg) {
			svg.children[0].firstElementChild.setAttribute(
				'fill',
				`rgb(${this.selectedColor})`
			)
			return svg
		},

		setColor(event) {
			this.selectedColor = event

			const fill = `rgb(${event})`
			document.getElementById('tankColor').style.fill = fill
		},

		hideColorPicker() {
			this.colorPickerShow = 'none'
			this.colorPickerPointerEvents = false
		},

		resetInputs() {
			this.selectedName = ''
			this.selectedColor = this.randomizeColor()
			this.selectedControls.fire = ''
			this.selectedControls.forward = ''
			this.selectedControls.backward = ''
			this.selectedControls.left = ''
			this.selectedControls.right = ''

			for (const ref of Object.values(this.$refs)) {
				ref.displayValue = ''
			}
		},

		openConfig() {
			this.$emit('input', true) // Menu wrapper handles opening config
		},
	},
}
</script>






// Buttons scale with the font-size:
<style lang="scss" scoped>
@import '@/scss/global';

.create-menu {
	width: 100%;
	height: 100%;

	@include window;

	padding: 3%;
	display: flex;
}

.add-player {
	@include bg(var(--light-text));
	@include small-outset;

	width: 50%;

	border-radius: 40px;

	display: grid;
	grid-template-rows: repeat(7, 1fr);
	grid-template-columns: 1fr 1fr;
	grid-template-areas:
		'name-input name-input'
		'controls select-color'
		'controls	select-color'
		'controls	select-color'
		'controls	select-color'
		'add-button	add-button'
		'add-button	add-button';
	align-items: center;
	justify-items: center;

	.add-player__name-input {
		@include bg(var(--light-text));
		@include shallow-inset;
		@include standard-input;

		grid-area: name-input;

		border-radius: 10em; // Completely rounded

		font-size: 1.5rem;

		text-align: center;
	}

	.controls {
		position: relative; // Necessary for the warning-positioning
		grid-area: controls;
		height: 80%;

		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-evenly;

		.controls__p--warning {
			position: absolute;
			top: -1rem;

			font-size: 0.7rem;
			font-weight: 500;
			color: var(--warning-color);
		}
	}

	.add-player__color-input {
		grid-area: select-color;
		width: 75%;
		// Resets:
		background: none;
		cursor: pointer;

		filter: drop-shadow(5px 5px 10px #8b91a0)
			//! Filter fucker med x, y mousecoords
			drop-shadow(-5px -5px 10px #ffffff);
	}

	.add-player__add-button {
		@include bg(var(--light-text));
		@include medium-outset;

		grid-area: add-button;

		border-radius: 10em; // Completely rounded

		font-family: Montserrat;
		font-size: 1.4rem;
		color: var(--dark-text);

		display: flex;
		align-items: center;
		padding: 0.5em 1.5em;

		&:active {
			@include medium-outset-active;
		}

		img {
			margin-right: 0.5em;
			height: 1.5em;
		}
	}
}

.start {
	width: 50%;

	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	.start__settings-button {
		@include bg(var(--light-text));
		@include medium-outset;

		align-self: flex-end;

		border-radius: 10em; // Completely rounded

		font-family: Montserrat;
		font-size: 1rem;
		color: var(--dark-text);

		display: flex;
		align-items: center;
		padding: 0.5em 1em;

		&:active {
			@include medium-outset-active;
		}

		img {
			width: 1.5em;
			margin-right: 0.5em;
		}
	}

	.titles {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		.titles__title {
			font-family: Montserrat;
			font-size: 4rem;
			color: var(--darkest-text);
			font-weight: normal;
		}

		.titles__subtitle {
			// @include h2;
			font-family: Raleway;
			font-size: 1.75rem;
			font-weight: 300;
			color: var(--dark-text);
			font-style: italic;
		}
	}

	.start__start-button {
		margin-bottom: 5%;
		@include bg(var(--cta-color));
		@include medium-darker-outset;

		color: var(--light-text);

		border-radius: 10em; // Completely rounded

		padding: 0.5em 1.5em;

		font-family: Montserrat;
		font-size: 2rem;
		font-weight: 500;

		display: flex;
		align-items: center;
		justify-content: center;

		&:active {
			box-shadow: 10px 10px 20px #9497a6, -10px -10px 20px #fafbff,
				inset 7px 7px 15px #0f39a1, inset -7px -7px 15px #4f81ff;
		}
	}
}
</style>