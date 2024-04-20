interface GameState {
	isWaitingForPlayers: boolean
	isPlacingShips: boolean
	isPlaying: boolean
	isAttacking: boolean
	isBeingAttacked: boolean
	isFinished: boolean

	isPlayerTurn: boolean
	isShipPlacement: boolean
}

interface BoardState {
	readonly boardOptions: {
		rows: number,
		cols: number,
	},
	player: {
		ships: Ship[],
		shots: number[],
		inventory: {
			ships: {
				size: number,
				amount: number,
			}[]
		}
	},
	opponent: {
		shots: number[]
	},
}

interface Ship {
	origin: number
	size: number
	orientation: "H" | "V",
	cells: number[]
}

export { BoardState, GameState, Ship }

