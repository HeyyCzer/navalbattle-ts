interface GameState {
	isMyTurn: boolean
	iAlreadyShot: boolean

	isWaitingForPlayers: boolean
	isPlacingShips: boolean
	isReady: boolean
	isPlaying: boolean
	isFinished: boolean

	timeToStart: number | null

	updateGame: (state: GameState) => void
}

interface Ship {
	origin: number
	size: number
	orientation: "H" | "V",
	cells: number[]
}

export { BoardState, GameState, Ship }

