class Inventory {

	ships: {
		size: number;
		amount: number;
	}[];

	constructor(ships: { size: number; amount: number; }[]) {
		this.ships = ships;
	}

}