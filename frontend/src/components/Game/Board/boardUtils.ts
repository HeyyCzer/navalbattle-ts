import { RefObject } from "react";
import { Ship } from "../game";

export function clearHolograms(
	ships: Ship[],
	shots: { cell: number }[],
	refs: RefObject<HTMLDivElement>[]
) {
	for (const [index, ref] of refs.entries()) {
		if (!ref.current) return;

		let shipFound = ships.some((ship) => ship.cells.includes(index));
		let shotFound = shots.some((shot) => shot.cell === index);
		if (!shipFound && !shotFound) {
			(ref.current as HTMLDivElement).style.backgroundColor = "";
		}
	}
}

export function paintCells(
	refs: RefObject<HTMLDivElement>[],
	color: string = ""
) {
	refs.forEach(ref => {
		if (!ref.current) return;
		(ref.current as HTMLDivElement).style.backgroundColor = color;
	});
}

function internalDrawHologram(
	currentCell: number,
	size: number,
	orientation: "H" | "V",
	boardOptions: { columns: number },
	refs: RefObject<HTMLDivElement>[],
	color: string = "rgba(255, 255, 255, 0.1)"
) {
	const cells = Array.from({ length: size }).map((_, i) => {
		return orientation === "H" ? currentCell + i : currentCell + i * boardOptions.columns;
	});
	
	const hologramRefs = refs.filter((_, i) => cells.includes(i));

	// If the ship starts in a line and goes to another, or don't fit in the board
	const breaksLine = cells.some((cell, i) => {
		if (i === 0) return false;
		return orientation === "H" ? cell % boardOptions.columns === 0 : false;
	});
	const isOutOfBoard = hologramRefs.length < size;
	if (breaksLine || isOutOfBoard) {
		return paintCells(hologramRefs, "rgba(255, 0, 0, 0.2)");
	}

	paintCells(hologramRefs, color);
}

export function drawShipHologram(
	currentCell: number,
	currentShipSize: number,
	shipOrientation: "H" | "V",
	boardOptions: { columns: number },
	ships: Ship[],
	refs: RefObject<HTMLDivElement>[]
) {
	// Check if ship conflicts with another
	const cells = Array.from({ length: currentShipSize }).map((_, i) => {
		return shipOrientation === "H" ? currentCell + i : currentCell + i * boardOptions.columns;
	});

	const isConflict = ships.some((ship) => {
		return ship.cells.some((cell) => cells.includes(cell));
	});

	if (isConflict) {
		return internalDrawHologram(currentCell, currentShipSize, shipOrientation, boardOptions, refs, "rgba(255, 0, 0, 0.2)");
	}
	internalDrawHologram(currentCell, currentShipSize, shipOrientation, boardOptions, refs);
}

export function internalDrawShootHologram(
	currentCell: number,
	refs: RefObject<HTMLDivElement>[],
	color: string = "rgba(255, 255, 255, 0.1)"
) {
	const shootRefs = refs.filter((_, i) => i === currentCell);
	paintCells(shootRefs, color);
}

export function drawShootHologram(
	currentCell: number,
	shots: { cell: number }[],
	refs: RefObject<HTMLDivElement>[],
	color: string = "rgba(255, 255, 255, 0.1)"
) {
	const isConflict = shots.some((shot) => shot.cell === currentCell);
	if (isConflict) {
		return internalDrawShootHologram(currentCell, refs, "rgba(255, 0, 0, 0.2)");
	}
	internalDrawShootHologram(currentCell, refs, color);
}

export function drawShip(ship: Ship, refs: RefObject<HTMLDivElement>[]) {
	const { cells } = ship;

	const shipsRefs = refs.filter((_, i) => cells.includes(i));
	paintCells(shipsRefs, "rgba(16, 185, 129, 0.2)");
}

export function drawHit(refs: RefObject<HTMLDivElement>[]) {
	paintCells(refs, "rgba(255, 0, 0, 0.5)");
}
