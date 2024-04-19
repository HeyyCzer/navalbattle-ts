import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameState {
	socket: Socket | null
	isPlayerTurn: boolean
	isShipPlacement: boolean
}

const useGameStore = create<GameState>()(
	devtools((set) => ({
		socket: null,
		isPlayerTurn: true,
		isShipPlacement: true,

		setSocket: (socket: Socket) => set({ socket }),
		setIsPlayerTurn: (isPlayerTurn: boolean) => set({ isPlayerTurn }),
		setIsShipPlacement: (isShipPlacement: boolean) => set({ isShipPlacement })
	}), {
		name: 'game-storage',
	}),
)

export default useGameStore;