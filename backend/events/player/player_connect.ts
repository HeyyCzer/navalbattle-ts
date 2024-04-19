import { GameEvent } from "../../event";

export default {
	name: "playerConnected",
	execute(server, client, gameId) {
		client.join(gameId);
		server.to(gameId).emit("playerConnected");
	}
} as GameEvent;