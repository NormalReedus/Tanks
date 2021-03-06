import GameState from './GameState.js'
import Tank from './Tank.js'
import grid from './grid.js'
import { randomCoords } from './helpers.js'

import store from '@/store'
const { p5 } = store.state
const { gameState, gameStatus, config } = store.getters

const game = {
	players: [],
	
	reset() { // Menus automatically update to match (create menu)
		store.commit('resetGameStatus')
	},

	addPlayer(player) {
		if (gameStatus().started) return console.log("Game has already started")

		// Players are initially put into a local array, and that array is committed to Vuex gameStatus to ensure reactivity:
		this.players.push(player)

		store.commit('addPlayer', player)
	},

	new() {
		// Cannot start twice or if there are no players:
		if (gameStatus().started || gameStatus().players.length <= 1) return console.log("Cannot start game")

		// Makes sure start-menu does not appear again (until game is recreated):
		store.commit('setCreatedStatus', true)


		this.start()
	},

	start() { // Uses arrow func to use 'this'
		console.log('Game started')

		// Sets up the ingame state (and resets everything):
		store.commit('setGameState', new GameState)

		// Makes all cells:
		grid.generate()

		// Sets random walls and references neighbors to cells:
		grid.setWallsAndNeighbors()
		
		// Removes specific walls to make sure every part is traversible:
		grid.generateMaze()

		// Adds players' tanks:
		for (const player of gameStatus().players) {

			let spawnCoords = randomCoords()

			// Makes new point if prior was too close to a tank:
			while (this._closeToTank(spawnCoords)) {
				spawnCoords = randomCoords()
			}

			const tank = new Tank(player.name, player.color, spawnCoords.x, spawnCoords.y, player.controls, player)
			tank.owner.tank = tank // lol

			store.commit('addTank', tank/*new Tank(player.name, player.color, spawnCoords.x, spawnCoords.y, player.controls, player)*/)
		}

		store.commit('setStartedStatus', true)

		// Hides menu:
		this.unpause()
	},

	_closeToTank(point) {
		for (const tank of gameState().tanks) {
			if (p5.dist(point.x, point.y, tank.x, tank.y) <= config().cell.width * config().tank.spawnDistance) {
				return true
			}
	
			continue
		}
	},

	// Checks if game should start counting towards ending:
	tankDestroyed() {
		if (gameState().tanks.length <= 1) {
			store.commit('gameEnding')
		}
	},

	end() { //TODO: Handle winner by checking who is left (if (state.tanks[0]) state.tanks[0].owner.wins++?)
		console.log('Game ended')
		if (gameState().tanks[0]) {
			gameState().tanks[0].owner.wins++
		}

		this.pause()
		store.commit('setStartedStatus', false)

	},

	pause() {
		console.log('Game paused')

		store.commit('setPauseStatus', true)
		p5.noLoop()
	},

	unpause() {
		console.log('Game unpaused')

		// Restarts when menu is gone:
		store.commit('setPauseStatus', false)
		p5.loop()
	},

	// Called once every frame:
	onFrame() {
		if (gameState().ending) {
			// Begins counting down for end:
			store.commit('endTimer')
		}

		// Checks if game should end:
		if (gameState().endTimer <= 0) {
			this.end()
		}
	}
}

export default game