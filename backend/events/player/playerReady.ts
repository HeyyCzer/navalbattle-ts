import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "playerReady",
	execute(server, client, gameId) {
		const game = getGame(gameId);
		if (game) {
			const player = game.getPlayerBySocketId(client.id);
			if (player) {
				player.setReadyToStart(true);
				game.checkConditionsToStart("play");
			}
		}
	}
} as GameEvent;