import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState } from './game';

const useGameStore = create<GameState>()(
	devtools((set) => ({
		isWaitingForPlayers: true,
		
		isPlacingShips: false,
		isPlaying: false,
		isAttacking: false,
		isBeingAttacked: false,

		isFinished: false,

		isPlayerTurn: true,
		isShipPlacement: true,

		setIsPlayerTurn: (isPlayerTurn: boolean) => set({ isPlayerTurn }),
		setIsShipPlacement: (isShipPlacement: boolean) => set({ isShipPlacement }),

		updateGame: (state: GameState) => set(state)
	}), {
		name: 'game-storage',
	}),
)

export default useGameStore;