import { useEffect, useRef, useState } from "react";
import useGameStore from "../store";
import { drawHologram } from "./boardUtils";
import useBoardStore from "./store";

interface GameBoardProps {
	tableOwner: "player" | "opponent";
}

const boardOptions = {
	rows: 10,
	cols: 10,
}
const totalCells = boardOptions.rows * boardOptions.cols;

export default function GameBoard(props: GameBoardProps) {
	const { isShipPlacement } = useGameStore(state => state);
	const { ships } = useBoardStore(state => state[props.tableOwner]);

	const refs = Array.from({ length: totalCells }).map(() => useRef(null));

	const [currentCell, setCurrentCell] = useState<number | null>(null);
	const [currentShipSize, setCurrentShipSize] = useState(5);
	const [shipOrientation, setShipOrientation] = useState<"H" | "V">("H");

	useEffect(() => {
		if (!isShipPlacement || currentCell === null || props.tableOwner !== "player") return;

		drawHologram(true, currentCell, currentShipSize, shipOrientation, { cols: boardOptions.cols, totalCells }, refs);

		return () => {
			drawHologram(false, currentCell, currentShipSize, shipOrientation, { cols: boardOptions.cols, totalCells }, refs);
		}
	}, [isShipPlacement, currentCell, shipOrientation]);

	// Toggle ship orientation
	useEffect(() => {
		if (!isShipPlacement || props.tableOwner !== "player") return;

		const updateOrientation = (e: KeyboardEvent) => {
			if (e.key === "r") {
				setShipOrientation((prev) => prev === "H" ? "V" : "H");
			}
		}

		window.addEventListener("keydown", updateOrientation);
		return () => {
			window.removeEventListener("keydown", updateOrientation);
		}
	}, [shipOrientation]);

	return (
		<div
			className="bg-gray-700/30 relative grid w-fit h-fit border border-gray-700"
			style={{ gridTemplateColumns: `repeat(${boardOptions.cols}, 1fr)` }}
		>
			{
				Array.from({ length: totalCells }).map((_, i) => (
					<div
						ref={refs[i]}
						onMouseEnter={() => setCurrentCell(i)}
						key={i} className="border border-gray-700 min-w-16 aspect-square"
					/>
				))
			}
		</div>
	)
}
