import { config } from "dotenv";
config();

import 'colorts/lib/string';

import { createServer } from "http";
import { Server } from "socket.io";
import { GameEvent } from './event';
import { getFiles } from "./utils/files";
import logger from './utils/logger';

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
	},
});

const events: GameEvent[] = [];

async function loadEvents() {
	logger.info("Loading events...".gray);

	const files = getFiles("./events");
	for (let file of files) {
		const data = (await import(file)).default as GameEvent;
		if (!data || !data.name || !data.execute) continue;

		logger.info(`Loaded event: ${data.name}`.gray);

		events.push(data);
	}

	logger.success("Loaded events!".gray);
}

io.on("connection", (socket: any) => {
	for (const event of events) {
		socket.on(event.name, (...args: any) => {
			logger.debug(`User: ${socket.id} | Event: ${event.name} | Json: ${JSON.stringify(args)}`.gray);
			event.execute(io, socket, ...args);
		});

		logger.debug(`Listening for event: ${event.name}`.gray);
	}
});

loadEvents().then(() => {
	httpServer.listen(8000, () => {
		logger.success("Listening on *:8000");
	});
})

export { io as server };
