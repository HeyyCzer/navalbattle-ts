class Game {

	id: string;
	board: Board;

	currentPlayer: Player | null;
	players: Player[];

	isWaitingForPlayers: boolean;
	isPlacingShips: boolean;
	isPlaying: boolean;
	isFinished: boolean;

	constructor(id: string, board: Board) {
		this.id = id;
		this.board = board;

		this.currentPlayer = null;
		this.players = [];

		this.isWaitingForPlayers = true;
		this.isPlacingShips = false;
		this.isPlaying = false;
		this.isFinished = false;
	}

	// Modify players
	getPlayer(id: string) {
		return this.players.find(player => player.id === id);
	}
	addPlayer(player: Player) {
		this.players.push(player);
	}
	removePlayer(id: string) {
		this.players = this.players.filter(player => player.id !== id);
	}
	nextPlayer() {
		if (this.currentPlayer === null) {
			this.currentPlayer = this.players[0];
		} else {
			const index = this.players.indexOf(this.currentPlayer);
			this.currentPlayer = this.players[(index + 1) % this.players.length];
		}
	}

	// Modify game-state
	startGame() {
		this.isWaitingForPlayers = false;
		this.isPlacingShips = true;
	}
	startPlaying() {
		this.isPlacingShips = false;
		this.isPlaying = true;
	}
	endGame() {
		this.isPlaying = false;
		this.isFinished = true;
	}
}
