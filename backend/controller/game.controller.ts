import { server } from "..";
import Board from "../classes/board";
import Game from "../classes/game";
import { createId } from "../utils/cuid";

const GAMES = new Map<string, Game>();

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
		const gameCopy = { ...game } as any;
		delete gameCopy.currentPlayer;
		delete gameCopy.players;
		server.to(game.id).emit("gameUpdated", gameCopy);
	}

	for (const player of game.players) {
		player.updateBoard(game);
	}
}
