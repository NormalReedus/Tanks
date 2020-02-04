import store from '@/store'
const { state } = store
const { p5, config } = state

import { getOffsetPoint, pointInRect, outOfBounds, getWallRect } from './helpers.js'

function StealthAmmo(owner, name) {
	const props = {
		owner,
		name
	}

	return {
		...props,
		...mixins.hasTimer(name),
		...mixins.canRemoveSelf(),

		_effect() {
			if (!this.owner.stealthedAmmo) {
				this.owner.stealthedAmmo = true
			}
		},

		_reset() {
			this.owner.stealthedAmmo = false
		}
	}
}

// Not pickuppable (thus not in lookup dict) - only gainable from equipment:
export function LaserSight(owner, name) {
	const props = {
		owner,
		name,
		color: p5.color(owner.color.levels) // Copies owner color instead of referencing the object
	}
	props.color.setAlpha(config.modifier.laserSight.alpha)

	return {
		...props,
		...mixins.canRemoveSelf(),

		_effect() {
			for (let dist = 0; dist < 9999; dist += config.wall.collisionStepSize) {
				// Potential end point:
				const point = getOffsetPoint(dist, owner.direction)
				const point2 = {
					x: point.x + owner.x,
					y: point.y + owner.y
				}

				for (const column of state.gameState.grid) {
					for (const cell of column) {
						for (const wall in cell.walls) { // for...in does not need to loop backwards 
							if (cell.walls[wall]) { // checks for existing walls only

								// Takes wall reference and calculates the rectangle:
								const wallRect = getWallRect(cell.walls[wall])

								// If point intersects the wall or if it is out of canvas:
								const out = outOfBounds(point2)
								if (pointInRect(point2, wallRect) || out.x || out.y) {

									const point1 = {
										x: owner.cannon.x,
										y: owner.cannon.y
									}

									// Actually shows effect:
									this._drawLaser(point1, point2)

									// Stops all further looping, since line has been drawn:
									return
								}
							}
						}
					}
				}
			}
		},

		_drawLaser(from, to) {
			p5.push()

			p5.strokeWeight(config.modifier.laserSight.width)
			p5.stroke(this.color)

			p5.line(from.x, from.y, to.x, to.y)

			p5.pop()
		},

		_removal() {
			if (!owner.equipment || !config.modifier.laserSight.onEquipment.includes(owner.equipment.name)) { // Order of checks are important - cannot check equipment.name if equipment is not there
				this._remove()
			}
		},

		// Has own version of onFrame(), since this is not timed (etc) like a pickup
		onFrame() {
			this._removal()

			this._effect()
		}
	}
}

//* COMPOSITIONAL MIXINS

const mixins = {

	hasTimer(name) {
		return {
			duration: config.modifier[name].duration,

			onFrame() {
				this._effect()

				this.duration--

				if (this.duration <= 0) {
					this._remove()
				}
			},
		}
	},

	canRemoveSelf() {
		return {
			_remove() {
				if (this._reset) this._reset() // Only for when permanent changes have been made, that need to be reset

				this.owner.modifiers.delete(this)
			}
		}
	}
}


//* LOOKUP DICTIONARY

export default {
	StealthAmmo,
}