import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useParams } from "wouter";
import useSocketStore from "../../Socket/store";
import { GameState, Ship } from "../game";
import useGameStore from "../store";
import { clearHolograms, drawShip, drawShipHologram, drawShootHologram } from "./boardUtils";

export default function GameBoard() {
	const socket = useSocketStore(state => state.socket);

	const { game } = useParams();

	const {
		isMyTurn,
		iAlreadyShot,

		isPlacingShips,
		isPlaying,
		isReady,

		timeToStart
	} = useGameStore((state: GameState) => state);

	const [boardOwner, setBoardOwner] = useState("you");
	const [boardOptions] = useState({
		columns: 10,
		rows: 10
	});

	const totalCells = useMemo(() => boardOptions.columns * boardOptions.rows, [boardOptions.columns, boardOptions.rows]);
	const refs = Array.from({ length: totalCells }).map(() => useRef(null));

	const [ships, setShips] = useState<Ship[]>([]);
	const [shots, setShots] = useState<{ cell: number }[]>([]);
	const [inventory, setInventory] = useState({
		ships: [] as {
			amount: 0,
			size: 0
		}[]
	});

	const [currentCell, setCurrentCell] = useState<number | null>(null);
	const [currentShipSize, setCurrentShipSize] = useState<number | null>(inventory.ships.find((s) => s.amount > 0)?.size ?? null);
	const [shipOrientation, setShipOrientation] = useState<"H" | "V">("H");

	useEffect(() => {
		if (!socket) return;

		socket.on("updateBoard", (board) => {
			setBoardOwner(board.boardOwner)
			setShips(board.ships);
			setShots(board.shots);
			setInventory(board.inventory);
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
			const cell = refs[shot.cell].current;
			if (!cell) return;

			// Check if some ship is in the cell
			const ship = ships.find((ship) => ship.cells.includes(shot.cell));
			if (ship) {
				(cell as HTMLDivElement).style.backgroundColor = "rgba(255, 0, 0, 0.3)";
			} else {
				// Amber color for missed shots
				(cell as HTMLDivElement).style.backgroundColor = "rgba(255, 215, 0, 0.2)";
			}
		}

		// Clear hologram cells
		clearHolograms(ships, shots, refs);

		// Clear old hologram cells and draw the new ones
		if (isPlacingShips) {
			if (currentCell !== null && currentShipSize !== null) {
				drawShipHologram(currentCell, currentShipSize, shipOrientation, boardOptions, ships, refs);
			}
		}

		if (isPlaying && isMyTurn) {
			if (currentCell !== null) {
				drawShootHologram(currentCell, shots, refs);
			}
		}
	}, [isPlacingShips, isPlaying, isMyTurn, currentCell, shipOrientation, ships, shots]);

	// Toggle ship orientation
	useEffect(() => {
		if (!isPlacingShips || boardOwner !== "you") return;
		
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
			if (currentCell === null || !currentShipSize || !shipOrientation || !socket || isReady) return;

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
			if (currentCell === null || !socket || isReady) return;

			// Right click to remove ship
			socket.emit("removeShip", { gameId: game, cell: currentCell });
		};
		window.addEventListener("contextmenu", handleRemoveShip);

		return () => {
			window.removeEventListener("keydown", handleUpdateOrientation);
			window.removeEventListener("contextmenu", handleRemoveShip);
			window.removeEventListener("mousedown", handlePlaceShip);
		}
	}, [boardOwner, socket, isPlacingShips, isReady, inventory, currentCell, currentShipSize, shipOrientation]);

	useEffect(() => {
		if (!isPlaying || !isMyTurn || iAlreadyShot) return;

		const handleShoot = (e: MouseEvent) => {
			e.preventDefault();
			if (currentCell === null || !socket) return;

			// Left click to place ship
			if (e.button === 0) {
				socket.emit("shoot", {
					gameId: game,
					cell: currentCell,
				});
			}
		}
		window.addEventListener("mousedown", handleShoot);

		return () => {
			window.removeEventListener("mousedown", handleShoot);
		}
	}, [socket, isPlaying, isMyTurn, iAlreadyShot, currentCell]);

	const handleReady = useCallback(() => {
		if (!socket) return;

		socket.emit("playerReady", {
			gameId: game,
			isReady: !isReady
		});
	}, [socket, isReady])

	return (
		<div className="px-2 w-full lg:w-1/3 mx-auto">
			<div
				className={twMerge(
					"bg-gray-700/30 grid w-full h-fit border border-gray-700",
					((isPlaying && isMyTurn) && "outline outline-1 outline-emerald-500/40"),
					((isPlaying && !isMyTurn) && "outline outline-1 outline-red-500/40")
				)}
				style={{ gridTemplateColumns: `repeat(${boardOptions.columns}, 1fr)` }}
				onMouseLeave={() => setCurrentCell(null)}
				onTouchEnd={() => setCurrentCell(null)}
			>
				{
					Array.from({ length: totalCells }).map((_, i) => (
						<div
							ref={refs[i]}
							onMouseEnter={() => setCurrentCell(i)}
							onTouchEnd={() => setCurrentCell(null)}
							key={i} className="border border-gray-700 w-auto aspect-square text-white/20 text-xs flex items-center justify-center"
						>
							{ i + 1 }
						</div>
					))
				}
			</div>

			{isPlacingShips && (
				<div className="mt-2">
					<div>
						<span className="text-xs uppercase tracking-widest">Navios no inventário:</span>
					</div>

					<div className="flex justify-between flex-wrap gap-2">
						{
							inventory && inventory.ships.sort((a, b) => a.size > b.size ? 1 : -1).map((ship, i) => (
								<button
									key={i}
									className={
										twMerge(
											"text-white/70 bg-white/30 px-2 py-1 rounded-md uppercase text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-emerald-700 hover:text-white",
											ship.size === currentShipSize && "bg-emerald-800 text-white"
										)}
									onClick={() => setCurrentShipSize(ship.size)}
									disabled={ship.amount === 0}
								>
									<span className={
										twMerge(
											"text-gray-400 mr-2 lowercase",
											ship.size === currentShipSize && "text-emerald-300"
										)}>
										({ship.amount}x)
									</span>
									{ship.size} bloco(s)
								</button>
							))
						}
					</div>

					<button
						onClick={handleReady}
						disabled={inventory.ships.some((ship) => ship.amount !== 0)}
						className={twMerge(
							"mt-6 flex bg-emerald-500 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 rounded-lg py-2 px-4 text-xs uppercase tracking-widest w-fit mx-auto",
							(isReady && "bg-red-500")
						)}
					>
						{!isReady ? "Estou pronto!" : "Mudei de ideia"}
					</button>
					{
						inventory.ships.some((ship) => ship.amount !== 0) && (
							<p className="text-sm text-center mt-2 text-gray-500">Posicione todos os seus navios para ficar pronto!</p>
						)
					}
					{
						(isReady && timeToStart === null) && (
							<p className="text-sm text-center mt-2 text-gray-500">Aguardando o outro jogador...</p>
						)
					}
					{
						timeToStart !== null && (
							<p className="text-sm text-center mt-2 text-gray-500">O jogo começará em {timeToStart} segundos...</p>
						)
					}
				</div>
			)}
		</div>
	)
}
