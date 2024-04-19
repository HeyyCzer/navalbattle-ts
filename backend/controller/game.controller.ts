const GAMES = new Map<string, Game>();

export function createGame(
	id: string,
	boardCols: number,
	boardRows: number
) {
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
