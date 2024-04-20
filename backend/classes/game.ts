import { saveGame } from "../controller/game.controller";
import Board from "./board";
import Player from "./player";

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
	getPlayerBySocketId(socketId: string) {
		return this.players.find(player => player.socketId === socketId);
	}
	addPlayer(player: Player) {
		if (this.players.length >= 2) {
			return;
		}

		if (this.players.some(p => p.id === player.id)) {
			return;
		}

		this.players.push(player);
		this.updateGame(false);
	}
	removePlayer(id: string) {
		this.players = this.players.filter(player => player.id !== id);
		this.updateGame(false);
	}
	nextPlayer() {
		if (this.currentPlayer === null) {
			this.currentPlayer = this.players[0];
		} else {
			const index = this.players.indexOf(this.currentPlayer);
			this.currentPlayer = this.players[(index + 1) % this.players.length];
		}
		this.updateGame(false);
	}

	// Modify game-state
	checkConditionsToStart(action: "place_ships" | "play") {
		if (action === "place_ships") {
			if (this.isPlacingShips || this.isPlaying || this.isFinished) return;
			if (this.players.length === 2) {
				this.startGame();
			}
		} else if (action === "play") {
			if (!this.isPlacingShips || this.isPlaying || this.isFinished) return;
			if (this.players.every(player => player.readyToStart)) {
				this.startPlaying();
			}
		}
	}

	startGame() {
		this.isWaitingForPlayers = false;
		this.isPlacingShips = true;
		this.updateGame(true);
	}
	startPlaying() {
		this.isPlacingShips = false;
		this.isPlaying = true;
		this.updateGame(true);
	}
	endGame() {
		this.isPlaying = false;
		this.isFinished = true;
		this.updateGame(true);
	}

	updateGame(updateForPlayers: boolean) {
		saveGame(this, updateForPlayers);
	}
}

export default Game;