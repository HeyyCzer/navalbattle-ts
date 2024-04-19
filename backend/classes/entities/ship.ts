class Ship {

	origin: number;
	size: number;
	orientation: "H" | "V";
	cells: number[];

	constructor(origin: number, size: number, orientation: "H" | "V") {
		this.origin = origin;
		this.size = size;
		this.orientation = orientation;
		this.cells = Array.from({ length: size }, (_, i) => origin + (orientation === "H" ? i : i * 10));
	}

}