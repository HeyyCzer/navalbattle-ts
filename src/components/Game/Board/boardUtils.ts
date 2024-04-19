import { RefObject } from "react";
import { Ship } from "../game";

export function paintCells(
	refs: RefObject<HTMLDivElement>[],
	color: string = ""
) {
	refs.forEach(ref => {
		if (!ref.current) return;
		(ref.current as HTMLDivElement).style.backgroundColor = color;
	});
}

export function drawHologram(
	currentCell: number,
	size: number,
	orientation: "H" | "V",
	boardOptions: { cols: number },
	refs: RefObject<HTMLDivElement>[],
	color: string = "rgba(255, 255, 255, 0.1)"
) {
	const cells = Array.from({ length: size }).map((_, i) => {
		return orientation === "H" ? currentCell + i : currentCell + i * boardOptions.cols;
	});
	
	const hologramRefs = refs.filter((_, i) => cells.includes(i));

	// If the ship starts in a line and goes to another, or don't fit in the board
	const breaksLine = cells.some((cell, i) => {
		if (i === 0) return false;
		return orientation === "H" ? cell % boardOptions.cols === 0 : false;
	});
	const isOutOfBoard = hologramRefs.length < size;
	if (breaksLine || isOutOfBoard) {
		return paintCells(hologramRefs, "rgba(255, 0, 0, 0.2)");
	}

	paintCells(hologramRefs, color);
}

export function drawShip(ship: Ship, refs: RefObject<HTMLDivElement>[]) {
	const { cells } = ship;

	const shipsRefs = refs.filter((_, i) => cells.includes(i));
	paintCells(shipsRefs, "rgba(16, 185, 129, 0.2)");
}

export function drawHit(refs: RefObject<HTMLDivElement>[]) {
	paintCells(refs, "rgba(255, 0, 0, 0.5)");
}
