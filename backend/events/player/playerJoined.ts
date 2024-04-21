import Player from "../../classes/player";
import { createGame, getGame, updateGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "playerJoined",
	execute(server, client, { gameId, playerId }) {
		let game = getGame(gameId);
		if (!game) {
			game = createGame(gameId, 10, 10);
		}

		if (!playerId) {
			playerId = client.id;
			client.emit("savePlayerId", playerId);
		}

		if (game.players.filter(player => player.id !== playerId).length >= 2) {
			client.emit("showToast", {
				type: "error",
				message: "Essa sala já está cheia! Tente outra.",
				time: 8000
			});
			client.emit("redirect", "/");
			return;
		}

		client.join(gameId);

		game.addPlayer(new Player(playerId, client.id));

		const player = game.getPlayer(playerId);
		if (player) {
			player.setSocketId(client.id);
		}

		game.checkConditions("place_ships");

		updateGame(game, player);	

		if (player) {
			player.updateBoard(game);
		}
	}
} as GameEvent;