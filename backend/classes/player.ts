class Player {

	id: string;

	ships: Ship[];
	shots: Shot[];
	inventory: Inventory;

	constructor(id: string) {
		this.id = id;
		this.ships = [];
		this.shots = [];
		this.inventory = new Inventory([
			{ size: 4, amount: 1 },
			{ size: 3, amount: 1 },
			{ size: 2, amount: 3 },
			{ size: 1, amount: 4 },
		]);
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
}