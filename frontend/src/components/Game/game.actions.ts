import useGameStore from "./store";

export function placeShip(
	cell: number,
	shipSize: number,
	orientation: "H" | "V"
) {
	const game = useGameStore.getState();
	if (!game.socket) return;

	game.socket.emit("placeShip", { cell, shipSize, orientation });
}

export function removeShip(cell: number) {
	const game = useGameStore.getState();
	if (!game.socket) return;

	game.socket.emit("removeShip", { cell });
}
