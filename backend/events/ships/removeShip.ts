import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "removeShip",
	execute(server, socket, { gameId, cell }) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayerBySocketId(socket.id);
		if (player) {
			player.removeShip(cell);
			player.updateBoard(game);
		}
	}
} as GameEvent;