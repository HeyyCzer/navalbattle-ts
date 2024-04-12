import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Ship } from '../game';

interface BoardState {
	player: {
		ships: Ship[]
	},
	opponent: {
		ships: Ship[]
	}
}

const useBoardStore = create<BoardState>()(
	devtools((set) => ({
		player: {
			ships: []
		},
		opponent: {
			ships: []
		}
	}), {
		name: 'board-storage',
	}),
)

export default useBoardStore;