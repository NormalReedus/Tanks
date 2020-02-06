import store from '@/store'
const { p5 } = store.state
const { config } = store.getters

import Wall from './Wall.js'


class Cell {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.w = config().cell.width
		// Makes a wall at chance, if wall is not on canvas edge:
		this.walls = {
			right: null,
			bottom: null
		}
		// For creating the maze:
		this.visited = false
	}

	get midpoint() {
		return {
			x: this.x + this.w / 2,
			y: this.y + this.w / 2
		}
	}

	randomWall(side) {
		return p5.random() < config().wall.occurrenceRate ? new Wall(this, side) : null
	}
}

export default Cell