import { useEffect, useState } from "react";
import { useParams } from "wouter";
import GameBoard from "../../components/Game/Board";
import WaitingPlayers from "../../components/Game/WaitingPlayers";
import { GameState } from "../../components/Game/game";
import useGameStore from "../../components/Game/store";
import Logo from "../../components/Logo";
import useSocketStore from "../../components/Socket/store";

export default function Game() {
	const playerName = "Jogador 1";

	const socket = useSocketStore(state => state.socket);
	const {
		isWaitingForPlayers,
		isPlacingShips,
		isPlaying,
		isFinished,
		updateGame
	} = useGameStore((state: any) => state);

	const [isPlayerTurn, setIsPlayerTurn] = useState(true);

	const { game } = useParams();

	useEffect(() => {
		if (!socket) return;

		socket.emit("playerJoined", sessionStorage.getItem("playerId"), game);

		socket.on("savePlayerId", (playerId: string) => {
			sessionStorage.setItem("playerId", playerId);
		});

		socket.on("gameUpdated", (game: GameState) => {
			console.log(game);
			updateGame(game)
		});

		return () => {
			socket.off("savePlayerId");
			socket.off("gameUpdated");
		}
	}, [socket])

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="text-center py-6">
				<Logo />
				<h3>
					Partida de{" "}
					<span id="lobbyOwner" className="text-emerald-500 font-semibold">{ playerName }</span>
				</h3>
			</div>

			<main className="mx-auto pb-8">
				<div className="flex gap-x-8">
					{
						isWaitingForPlayers && (
							<WaitingPlayers />
						)
					}

					{
						(isPlacingShips || isPlaying || isFinished) && (
							<div>
								<div className="text-center my-4 h-12">
									<div className={ !isPlayerTurn ? "hidden" : "" }>
										{/* Status bar */}
										<h5 className="uppercase tracking-wide text-sm font-medium text-emerald-500">Posicione seus navios!</h5>
										<p className="text-xs text-white/80">
											Selecione um navio e clique em uma célula para posicionar.
										</p>
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