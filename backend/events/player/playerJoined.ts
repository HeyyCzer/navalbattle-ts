import Player from "../../classes/player";
import { createGame, getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "playerJoined",
	execute(server, client, playerId, gameId) {
		let game = getGame(gameId);
		if (!game) {
			game = createGame(gameId, 8, 8);
		}

		if (!playerId) {
			playerId = client.id;
			client.emit("savePlayerId", playerId);
		}

		client.join(gameId);

		game.addPlayer(new Player(playerId, client.id));

		const player = game.getPlayer(playerId);
		if (player) {
			player.setSocketId(client.id);
		}

		game.checkConditionsToStart("place_ships");

		const gameCopy = { ...game } as any;
		delete gameCopy.currentPlayer;
		delete gameCopy.players;
		client.emit("gameUpdated", game);

		if (player && !game.isWaitingForPlayers) {
			player.updateBoard(game);
		}
	}
} as GameEvent;