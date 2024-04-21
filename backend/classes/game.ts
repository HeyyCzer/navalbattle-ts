import { server } from "..";
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

	timeToStart: number | null = null;
	timer: NodeJS.Timeout | null = null;

	createdAt: number = new Date().getTime();

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
			this.currentPlayer.alreadyShot = false;

			const index = this.players.indexOf(this.currentPlayer);
			this.currentPlayer = this.players[(index + 1) % this.players.length];
		}

		this.updateRender();
		this.updateGame(true);
	}
	updateRender() {
		const attacker = this.currentPlayer;
		const defender = this.players.find(player => player.id !== attacker?.id);

		if (!attacker || !defender) return;
		if (!attacker.socketId || !defender.socketId) return;

		// Only ship cells that are hit
		const filtredShips = defender.ships.map(ship => {
			const cells = ship.cells.filter(cell => attacker.shots.some(shot => shot.cell === cell));
			return { ...ship, cells };
		});

		// Update attacker
		server.to(attacker.socketId).emit("updateBoard", {
			ships: filtredShips,
			shots: attacker.shots,
			inventory: {
				ships: []
			}
		});

		// Update defender
		server.to(defender.socketId).emit("updateBoard", {
			ships: defender.ships,
			shots: attacker.shots,
			inventory: {
				ships: []
			}
		});
	}

	// Modify game-state
	checkConditions(action: "place_ships" | "play" | "game_over") {
		if (action === "place_ships") {
			if (this.isPlacingShips || this.isPlaying || this.isFinished) return;
			if (this.players.length === 2) {
				this.startPlacingShips();
			}
		} else if (action === "play") {
			if (!this.isPlacingShips || this.isPlaying || this.isFinished) return;
			if (this.players.every(player => player.readyToStart)) {
				this.startTimer();
			}
		} else if (action === "game_over") {
			if (!this.isPlaying || this.isFinished) return;
			
			// Check if every defender ship cell is hit by shots
			const defender = this.players.find(player => player.id !== this.currentPlayer?.id);
			if (!defender) return;

			const isGameOver = defender.ships.every(ship => ship.cells.every(cell => this.currentPlayer?.shots.some(shot => shot.cell === cell)));
			if (isGameOver) {
				if (defender.socketId) {
					server.to(defender.socketId).emit("showToast", {
						message: "😿 Você perdeu! Mas está tudo bem, não foi por falta de esforço!",
						time: 20000,
					});
				}

				if (this.currentPlayer?.socketId) {
					server.to(this.currentPlayer.socketId).emit("showToast", {
						message: "🥇 Você venceu o jogo. Foi uma bela partida!",
						time: 20000,
					});
				}

				server.to(this.id).emit("redirect", "/");

				this.endGame();
			}
		}
	}

	startTimer() {
		this.timeToStart = 5;
		this.timer = setInterval(() => {
			if (this.timeToStart === null || !this.isPlacingShips || this.isPlaying || this.isFinished || !this.players.every(player => player.readyToStart)) {
				this.timeToStart = null;
				this.updateGame(true);
				clearInterval(this.timer as NodeJS.Timeout);
				return;
			}
			
			if (this.timeToStart === 0) {
				clearInterval(this.timer as NodeJS.Timeout);
				this.startPlaying();
			} else {
				this.timeToStart--;
				this.updateGame(true);
			}
		}, 1000);
	}

	startPlacingShips() {
		this.isWaitingForPlayers = false;
		this.isPlacingShips = true;
		this.updateGame(true);
	}
	startPlaying() {
		this.isPlacingShips = false;
		this.isPlaying = true;
		this.nextPlayer();
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