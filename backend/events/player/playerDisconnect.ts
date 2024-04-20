import { invalidatePlayerSocketId } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "disconnect",
	execute(server, client) {
		invalidatePlayerSocketId(client.id);
	}
} as GameEvent;