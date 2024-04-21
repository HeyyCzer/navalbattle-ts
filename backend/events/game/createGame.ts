import { createGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "createGame",
	async execute(server, client, { columns, rows }) {
		const game = createGame(null, columns, rows);
		client.emit("redirect", `/game/${game.id}`);
	}
} as GameEvent;