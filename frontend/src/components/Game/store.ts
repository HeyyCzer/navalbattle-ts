import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { GameState } from './game';

const useGameStore = create<GameState>()(
	devtools((set) => ({
		isMyTurn: false,
		iAlreadyShot: false,

		isWaitingForPlayers: true,
		isPlacingShips: false,
		isReady: false,
		isPlaying: false,

		isFinished: false,

		timeToStart: null,

		updateGame: (state: GameState) => set(state)
	}), {
		name: 'game-storage',
	}),
)

export default useGameStore;