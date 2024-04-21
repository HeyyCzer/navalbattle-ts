import { useEffect } from "react";
import { useParams } from "wouter";
import GameBoard from "../../components/Game/Board";
import WaitingPlayers from "../../components/Game/WaitingPlayers";
import { GameState } from "../../components/Game/game";
import useGameStore from "../../components/Game/store";
import Navbar from "../../components/Navbar";
import useSocketStore from "../../components/Socket/store";

export default function Game() {
	const socket = useSocketStore(state => state.socket);
	const {
		isMyTurn,

		isWaitingForPlayers,
		isPlacingShips,
		isReady,
		isPlaying,
		isFinished,
		updateGame
	} = useGameStore(state => state);

	const { game } = useParams();

	useEffect(() => {
		if (!socket) return;

		socket.emit("playerJoined", {
			gameId: game,
			playerId: sessionStorage.getItem("playerId"),
		});

		socket.on("savePlayerId", (playerId: string) => {
			sessionStorage.setItem("playerId", playerId);
		});

		socket.on("gameUpdated", (game: GameState) => {
			console.log("Game updated", game);
			updateGame(game);
		});

		return () => {
			socket.off("savePlayerId");
			socket.off("gameUpdated");
		}
	}, [socket, isWaitingForPlayers])

	return (
		<div className="flex flex-col">
			{/* Header */}
			<Navbar />

			<main className="mx-auto pb-8 w-full">
				<div className="flex flex-col gap-x-8">
					{
						isWaitingForPlayers && (
							<WaitingPlayers />
						)
					}

					{
						(isPlacingShips || isPlaying || isFinished) && (
							<div className="w-full">
								<div className="text-center my-4 h-12">
									{/* Your */}
									<div>
										{/* Status bar */}
										{
											(isPlacingShips && !isReady) && (
												<>
													<h5 className="uppercase tracking-wide text-sm font-medium text-emerald-500">Posicione seus navios!</h5>
													<p className="text-xs text-white/80">
														Selecione um navio e clique em uma célula para posicionar.
													</p>
												</>
											)
										}
										{
											(isReady && isPlacingShips) && (
												<>
													<h5 className="uppercase tracking-wide text-sm font-medium text-emerald-500">Aguarde o oponente</h5>
													<p className="text-xs text-white/80">
														Aguarde o oponente posicionar seus navios.
													</p>
												</>
											)
										}
										{
											(isPlaying && isMyTurn) && (
												<>
													<h5 className="uppercase tracking-wide text-sm font-medium text-emerald-500">Sua vez!</h5>
													<p className="text-xs text-white/80">
														Clique em uma célula para atirar.
													</p>
												</>
											)
										}
										{
											(isPlaying && !isMyTurn) && (
												<>
													<h5 className="uppercase tracking-wide text-sm font-medium text-red-500">Aguarde o oponente</h5>
													<p className="text-xs text-white/80">
														Seu oponente está escolhendo onde atirar.
													</p>
												</>
											)
										}
									</div>
								</div>
		
								{/* Game board */}
								<GameBoard />
							</div>
						)
					}
				</div>
			</main>
		</div>
	);
}