import { server } from "..";
import Ship from "./entities/ship";
import Shot from "./entities/shot";
import Game from "./game";
import Inventory from "./inventory";

class Player {

	id: string;
	socketId: string | null;

	ships: Ship[];
	shots: Shot[];
	inventory: Inventory;

	readyToStart: boolean = false;

	constructor(id: string, socketId: string) {
		this.id = id;
		this.socketId = socketId;

		this.ships = [];
		this.shots = [];
		this.inventory = new Inventory([
			{ size: 4, amount: 1 },
			{ size: 3, amount: 1 },
			{ size: 2, amount: 3 },
			{ size: 1, amount: 4 },
		]);
	}

	setSocketId(socketId: string | null) {
		this.socketId = socketId;
	}
	setReadyToStart(readyToStart: boolean) {
		this.readyToStart = readyToStart;
	}

	getShip(cell: number) {
		return this.ships.find(ship => ship.cells.includes(cell));
	}
	addShip(ship: Ship) {
		this.ships.push(ship);
	}
	placeShip(origin: number, size: number, orientation: "H" | "V") {
		const ship = new Ship(origin, size, orientation);
		this.addShip(ship);
	}
	removeShip(cell: number) {
		this.ships = this.ships.filter(ship => !ship.cells.includes(cell));
	}

	updateBoard(game: Game | null) {
		if (this.socketId) {
			server.to(this.socketId).emit("updateBoard", {
				boardOwner: game?.isPlacingShips || game?.currentPlayer?.id !== this.id ? "you" : "opponent",
				ships: this.ships,
				shots: this.shots,
				inventory: this.inventory,
			});
		}
	}
}

export default Player;