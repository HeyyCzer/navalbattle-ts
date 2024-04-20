import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useParams } from "wouter";
import useSocketStore from "../../Socket/store";
import { Ship } from "../game";
import useGameStore from "../store";
import { drawHologram, drawShip } from "./boardUtils";

export default function GameBoard() {
	const socket = useSocketStore(state => state.socket);

	const { game } = useParams();
	const { isShipPlacement, isAttacking, isBeingAttacked } = useGameStore(state => state);

	const [boardOwner, setBoardOwner] = useState("you");
	const [boardOptions, setBoardOptions] = useState({
		rows: 10,
		columns: 10
	});

	const [ships, setShips] = useState<Ship[]>([]);
	const [shots, setShots] = useState<number[]>([]);
	const [inventory, setInventory] = useState({
		ships: [] as {
			amount: 0,
			size: 0
		}[]
	});

	const totalCells = useMemo(() => boardOptions.columns * boardOptions.rows, [boardOptions.columns, boardOptions.rows]);
	const refs = Array.from({ length: totalCells }).map(() => useRef(null));

	const [currentCell, setCurrentCell] = useState<number | null>(null);
	const [currentShipSize, setCurrentShipSize] = useState<number | null>(inventory.ships.find((s) => s.amount > 0)?.size ?? null);
	const [shipOrientation, setShipOrientation] = useState<"H" | "V">("H");

	useEffect(() => {
		if (!socket) return;

		socket.on("updateBoard", (player) => {
			console.log("updateBoard", player);
			setBoardOwner(player.boardOwner)
			setShips(player.ships);
			setShots(player.shots);
			setInventory(player.inventory);
		});

		return () => {
			socket.off("updateBoard");
		}
	}, [socket]);

	useEffect(() => {
		// Render ships
		for (const ship of ships) {
			drawShip(ship, refs);
		}

		// Render shots
		for (const shot of shots) {
			const cell = refs[shot].current;
			if (!cell) return;

			// Check if some ship is in the cell
			const ship = ships.find((ship) => ship.cells.includes(shot));
			if (ship) {
				(cell as HTMLDivElement).style.backgroundColor = "red";
			} else {
				(cell as HTMLDivElement).style.backgroundColor = "rgba(255, 255, 255, 0.2)";
			}
		}

		// Clear old hologram cells and draw the new ones
		if (isShipPlacement) {
			// Clear hologram cells
			for (const [index, ref] of refs.entries()) {
				if (!ref.current) return;
		
				let shipFound = false;
				for (const ship of ships) {
					if (ship.cells.includes(index)) {
						shipFound = true;
						break;
					}
				}

				if (!shipFound) {
					(ref.current as HTMLDivElement).style.backgroundColor = "";
				}
			}
			
			if (currentCell !== null && currentShipSize !== null) {
				// Check if ship conflicts with another
				const cells = Array.from({ length: currentShipSize }).map((_, i) => {
					return shipOrientation === "H" ? currentCell + i : currentCell + i * boardOptions.columns;
				});

				const isConflict = ships.some((ship) => {
					return ship.cells.some((cell) => cells.includes(cell));
				});

				if (isConflict) {
					return drawHologram(currentCell, currentShipSize, shipOrientation, boardOptions, refs, "rgba(255, 0, 0, 0.2)");
				}
				drawHologram(currentCell, currentShipSize, shipOrientation, boardOptions, refs);
			}
		}
	}, [isShipPlacement, currentCell, shipOrientation, ships, shots]);

	// Toggle ship orientation
	useEffect(() => {
		if (!isShipPlacement || boardOwner !== "you") return;
		
		if (inventory && inventory.ships.find((s) => s.size === currentShipSize)?.amount === 0) {
			const foundShip = inventory.ships.find((s) => s.amount > 0);
			setCurrentShipSize(foundShip?.size ?? null);
		}
		
		// Update ship orientation
		const handleUpdateOrientation = (e: KeyboardEvent) => {
			if (e.key === "r") {
				setShipOrientation((prev) => prev === "H" ? "V" : "H");
			}
		}
		window.addEventListener("keydown", handleUpdateOrientation);

		// Place ship
		const handlePlaceShip = (e: MouseEvent) => {
			e.preventDefault();
			if (currentCell === null || !currentShipSize || !shipOrientation || !socket) return;

			// Left click to place ship
			if (e.button === 0) {
				socket.emit("placeShip", {
					gameId: game,
					origin: currentCell,
					size: currentShipSize,
					orientation: shipOrientation
				});
			}
		}
		window.addEventListener("mousedown", handlePlaceShip);

		// Remove ship
		const handleRemoveShip = (e: MouseEvent) => {
			e.preventDefault();
			if (currentCell === null || !socket) return;

			// Right click to remove ship
			socket.emit("removeShip", { gameId: game, cell: currentCell });
		};
		window.addEventListener("contextmenu", handleRemoveShip);

		return () => {
			window.removeEventListener("keydown", handleUpdateOrientation);
			window.removeEventListener("contextmenu", handleRemoveShip);
			window.removeEventListener("mousedown", handlePlaceShip);
		}
	}, [boardOwner, socket, isShipPlacement, inventory, currentCell, currentShipSize, shipOrientation]);

	return (
		<div>
			{/* Debug */}
			{/* {
				<div className="*:block">
					<span>MyId: { String(sessionStorage.getItem("playerId")) }</span>
					<span>TableOwner: { String(boardOwner) }</span>
					<span>CurrentCell: { String(currentCell) }</span>
					<span>IsShipPlacement?: { String(isShipPlacement) }</span>
					<span>ShipOrientation: { String(shipOrientation) }</span>
					<span>ShipSize: { String(currentShipSize) }</span>
				</div>
			} */}

			<div
				className="bg-gray-700/30 grid w-fit h-fit border border-gray-700"
				style={{ gridTemplateColumns: `repeat(${boardOptions.columns}, 1fr)` }}
				onMouseLeave={() => setCurrentCell(null)}
			>
				{
					Array.from({ length: totalCells }).map((_, i) => (
						<div
							ref={refs[i]}
							onMouseEnter={() => setCurrentCell(i)}
							key={i} className="border border-gray-700 min-w-16 aspect-square text-white/20 text-xs flex items-center justify-center"
						>
							{ i + 1 }
						</div>
					))
				}
			</div>

			<div className="mt-2">
				<div>
					<span className="text-xs uppercase tracking-widest">Navios no inventário:</span>
				</div>

				<div className="flex justify-between flex-wrap">
					{
						inventory && inventory.ships.sort((a, b) => a.size > b.size ? 1 : -1).map((ship, i) => (
							<button
								key={i}
								className={
									twMerge(
										"text-white/70 bg-gray-700/40 px-2 py-1 rounded-md uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 hover:text-white",
										ship.size === currentShipSize && "bg-emerald-800 text-white"
									)}
								onClick={() => setCurrentShipSize(ship.size)}
								disabled={ship.amount === 0}
							>
								<span className="text-white/30 mr-2 lowercase">
									({ship.amount}x)
								</span>
								{ship.size} bloco(s)
							</button>
						))
					}
				</div>

				<button className="mt-6 flex bg-emerald-500 rounded-lg py-2 px-4 text-xs uppercase tracking-widest w-fit mx-auto">
					Estou pronto!
				</button>
			</div>
		</div>
	)
}
