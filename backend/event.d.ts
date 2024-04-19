import { Server, Socket } from 'socket.io';

interface GameEvent {
	name: string;
	execute (server: Server, socket: Socket, ...args: any): void;
}