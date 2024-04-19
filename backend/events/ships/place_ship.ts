import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "placeShip",
	execute(server, socket, gameId, origin, size, orientation) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayer(socket.id);

		if (player) {
			player.placeShip(origin, size, orientation);
			server.to(gameId).emit("shipPlaced", player.id, origin, size, orientation);
		}
	}
} as GameEvent;