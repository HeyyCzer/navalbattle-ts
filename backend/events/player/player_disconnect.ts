import { GameEvent } from "../../event";
import logger from "../../utils/logger";

export default {
	name: "disconnect",
	execute(server, socket, reason) {
		logger.debug(`User: ${socket.id} | A user disconnected with reason: ${reason}`);
	}
} as GameEvent;