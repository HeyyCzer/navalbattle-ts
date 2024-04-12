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
	placing: boolean,
	currentCell: number | null,
	currentShipSize: number,
	shipOrientation: "H" | "V",
	boardOptions: { totalCells: number, cols: number },
	refs: RefObject<HTMLDivElement>[]
) {
	if (currentCell === null) return;

	const color = placing ? "rgba(255, 255, 255, 0.2)" : "";
	const errorColor = "rgba(255, 0, 0, 0.2)";

	if (shipOrientation === "H") {
		for (let i = 0; i < currentShipSize; i++) {
			// Render error
			if (placing && currentCell % boardOptions.cols + currentShipSize > boardOptions.cols) {
				for (let i = 0; i < currentShipSize; i++) {
					// Draw error only in the same row
					if (Math.floor((currentCell + i) / boardOptions.cols) !== Math.floor(currentCell / boardOptions.cols)) return;

					const cell = refs[currentCell + i]?.current;
					if (!cell) return;

					(cell as HTMLDivElement).style.backgroundColor = errorColor;
				}

				// Render hologram
			} else {
				const cell = refs[currentCell + i]?.current;
				if (!cell) return;

				(cell as HTMLDivElement).style.backgroundColor = color;
			}
		}
	} else {
		for (let i = 0; i < currentShipSize; i++) {
			// Render error
			if (placing && currentCell + i * boardOptions.cols >= boardOptions.totalCells) {
				for (let i = 0; i < currentShipSize; i++) {
					const cell = refs[currentCell + i * boardOptions.cols]?.current;
					if (!cell) return;

					(cell as HTMLDivElement).style.backgroundColor = errorColor;
				}

				// Render hologram
			} else {
				const cell = refs[currentCell + i * boardOptions.cols]?.current;
				if (!cell) return;

				(cell as HTMLDivElement).style.backgroundColor = color;
			}

		}
	}
}

export function drawShip(ship: Ship, color: string, refs: RefObject<HTMLDivElement>[]) {
	const { origin, size, orientation } = ship;

	const cells = Array.from({ length: size }).map((_, i) => {
		return orientation === "H" ? origin + i : origin + i * 10;
	});

	const shipsRefs = refs.filter((_, i) => cells.includes(i));
	paintCells(shipsRefs, color);
}

export function drawHit(refs: RefObject<HTMLDivElement>[]) {
	paintCells(refs, "rgba(255, 0, 0, 0.5)");
}
