import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "removeShip",
	execute(server, socket, gameId, ship) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayer(socket.id);

		if (player) {
			player.removeShip(ship);
			server.to(gameId).emit("shipRemoved", player.id, ship);
		}
	}
} as GameEvent;