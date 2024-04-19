import { createServer } from "http";
import { Server } from "socket.io";
import { getFiles } from "./utils/files";

const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:5173",
		methods: ["GET", "POST"],
	},
});

const events = [];
const files = getFiles("./events");
for (const file of files) {
	const data = require(file);
	
	// data.name
	// data.execute

	events.push(...data);
}

io.on("connection", (socket) => {
	console.log(`User: ${socket.id} | A user connected`);

	for (const event of events) {
		socket.on(event.name, (...args) => {
			console.log(`User: ${socket.id} | Event: ${event.name} | Json: ${JSON.stringify(args)}`);
			event.execute(socket, ...args);
		});
	}
});

httpServer.listen(8000, () => {
	console.log("listening on *:8000");
});
