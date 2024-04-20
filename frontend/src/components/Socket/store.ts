import { Socket } from 'socket.io-client';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface SocketState {
	socket: Socket | null
	setSocket: (socket: Socket) => void
}

const useSocketStore = create<SocketState>()(
	devtools((set) => ({
		socket: null,

		setSocket: (socket: Socket) => set({ socket }),
	}), {
		name: 'socket-storage',
	}),
)

export default useSocketStore;