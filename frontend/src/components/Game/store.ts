import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameState {
	isPlayerTurn: boolean
	isShipPlacement: boolean
}

const useGameStore = create<GameState>()(
	devtools((set) => ({
		isPlayerTurn: true,
		isShipPlacement: true,
	}), {
		name: 'game-storage',
	}),
)

export default useGameStore;