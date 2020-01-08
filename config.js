config = { //TODO: Lav om til class, som også kan mutere sig selv
	fps: 60,
	game: {
		endFrames: 60 * 3 // Seconds
	},
	pickup: {
		size: 25, // ~25px should be default for designs
		spawnInterval: 60 * 5, // Secs
		spawnChance: 0.5
	},
	equipment: {
		wormhole: {
			chargeFrames: 60 * 2 // Seconds
		},
		m82: {
			ammo: 3,
			diameter: 3, // px
			speed: 12,
			penetrationSpeedDivisor: 3
		}
	},
	tank: {
		diameter: 20,
		moveSpeed: 1.5, // Has to be less than the width of walls to not pass through
		turnSpeed: 4,
		cannon: {
			length: 18,
			width: 3,
			midOffsetFraction: 5
		},
		ammo: 5,
		collisionMoveSlow: 2.5,
		collisionTurnSlow: 2,
		spawnDistance: 1,
		defaultColor: 'ff0000', //? remove
	},
	env: { //TODO: omskriv til cell. og wall.
		cellWidth: 55, // px
		cellAmtX: 15,
		cellAmtY: 10,
		wallStroke: 6,
		wallOccurrence: 0.8,
		collisionStepSize: null // SET AFTER INITIATION - Steps for checking will be highest possible value, that's still lower than walls (so projectiles faster than wallStrokes will not fly through)
	},
	bullet: {
		speed: 3,
		diameter: 8,
		duration: 60 * 6, // Seconds
	},
	effects: {
		muzzleSize: 2.5, // Times the size of regular bullet
		muzzleSpeed: 1, // Px reduction per frame
		defaultShakeMagnitude: 2,
		bulletTrailAlpha: 80, // Out of 255
		bulletTrailLength: 25 // Frames / points
	}
}

// Setting step size, without the size having to be calculated every time it is accessed:
config.env.collisionStepSize = config.env.wallStroke - 1