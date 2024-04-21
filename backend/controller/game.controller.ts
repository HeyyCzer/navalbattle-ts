import { server } from "..";
import Board from "../classes/board";
import Game from "../classes/game";
import Player from "../classes/player";
import { createId } from "../utils/cuid";

const GAMES = new Map<string, Game>();

setInterval(() => {
	GAMES.forEach(game => {
		if (game.createdAt + 2 * 60 * 1000 > new Date().getTime()) return;
		deleteGame(game.id);
	});
}, 60 * 1000);

export function createGame(
	id: string | null,
	boardCols: number,
	boardRows: number
) {
	id = id ?? createId();

	const board = new Board(boardCols, boardRows);
	const game = new Game(id, board);

	GAMES.set(id, game);

	return game;
}

export function getGame(id: string) {
	return GAMES.get(id);
}

export function deleteGame(id: string) {
	GAMES.delete(id);
}

export function invalidatePlayerSocketId(playerId: string) {
	GAMES.forEach(game => {
		const player = game.getPlayer(playerId);
		if (!player) return;

		player.setSocketId(null);
	});
}

export function removePlayerFromAnyGame(playerId: string) {
	GAMES.forEach(game => {
		game.removePlayer(playerId);
	});
}

export function saveGame(game: Game, updateForPlayers: boolean) {
	GAMES.set(game.id, game);

	if (updateForPlayers) {
		updateGame(game, null);	
	}
}

export function updateGame(game: Game, target: Player | null = null) {
	let targets = game.players;
	if (target) {
		targets = [target];
	}

	const gameCopy = { ...game } as any;
	delete gameCopy.currentPlayer;
	delete gameCopy.players;
	delete gameCopy.timer;

	for (const player of targets) {
		if (!player.socketId) continue;

		gameCopy.isReady = player.readyToStart;
		gameCopy.isMyTurn = game.isPlaying && game.currentPlayer?.id === player.id;
		gameCopy.iAlreadyShot = player.alreadyShot;

		server.to(player.socketId).emit("gameUpdated", gameCopy);
	}
}