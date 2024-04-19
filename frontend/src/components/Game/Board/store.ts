import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Ship } from '../game';

interface BoardState {
	readonly boardOptions: {
		rows: number,
		cols: number,
	},
	player: {
		ships: Ship[],
		hits: number[],
		inventory: {
			ships: {
				size: number,
				amount: number,
			}[]
		}
	},
	opponent: {
		hits: number[]
	},

	// placeShip: (cell: number, shipSize: number, orientation: "H" | "V") => void,
	// removeShip: (targetCell: number) => void,
}

const useBoardStore = create<BoardState>()(
	devtools((set) => ({
		boardOptions: {
			rows: 10,
			cols: 10,
		},
		player: {
			ships: [],
			hits: [],
			inventory: {
				ships: [],
			}
		},
		opponent: {
			hits: [],
		},

		// TODO: Take this responsibility to the backend
		// placeShip: (cell, shipSize, orientation) => set((state) => {
		// 	if (state.player.ships.some((s) => s.cells.includes(cell))) return state;

		// 	const newShip: Ship = {
		// 		origin: cell,
		// 		size: shipSize,
		// 		orientation,
		// 		cells: Array.from({ length: shipSize }, (_, i) => {
		// 			return orientation === "H" ? cell + i : cell + i * 10;
		// 		}),
		// 	}

		// 	// if (shipSize) {
		// 	// 	const foundShip = state.player.inventory.ships.find((s) => s.size === shipSize);
		// 	// 	if (foundShip) {
		// 	// 		foundShip.amount -= 1;
		// 	// 	}
		// 	// }

		// 	return {
		// 		...state,
		// 		player: {
		// 			...state.player,
		// 			ships: [...state.player.ships, newShip],
		// 			// inventory: state.player.inventory,
		// 		},
		// 	};
		// }),
		// removeShip: (targetCell) => set((state: BoardState) => {
		// 	// TODO: Move to backend
		// 	// const ship = state.player.ships.find((s) => s.cells.includes(targetCell));
		// 	// const shipSize = ship?.size;
		// 	// if (shipSize) {
		// 	// 	const foundShip = state.player.inventory.ships.find((s) => s.size === shipSize);
		// 	// 	if (foundShip) {
		// 	// 		foundShip.amount += 1;
		// 	// 	}
		// 	// }

		// 	return {
		// 		...state,
		// 		player: {
		// 			...state.player,
		// 			ships: state.player.ships.filter((s) => !s.cells.includes(targetCell)),
		// 			// inventory: state.player.inventory,
		// 		},
		// 	}
		// }),
	}), {
		name: 'board-storage',
	}),
)

export default useBoardStore;