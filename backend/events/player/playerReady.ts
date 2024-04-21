import { getGame, updateGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "playerReady",
	execute(server, client, { gameId, isReady }) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayerBySocketId(client.id);
		if (!player) return;
		if (player.inventory.ships.some((s) => s.amount > 0)) {
			client.emit("showToast", {
				type: "error",
				message: "Você ainda tem navios para posicionar!"
			});
			return;
		}

		player.setReadyToStart(isReady);
		game.checkConditions("play");

		updateGame(game, player);
	}
} as GameEvent;