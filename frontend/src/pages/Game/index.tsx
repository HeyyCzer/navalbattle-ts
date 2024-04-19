import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import GameBoard from "../../components/Game/Board";
import Logo from "../../components/Logo";

export default function Game() {
	const playerName = "Jogador 1";

	const [isPlayerTurn, setIsPlayerTurn] = useState(true);

	useEffect(() => {
		const socket = io(`http://localhost:8000`, {
			reconnectionDelayMax: 10000,
		});

		socket.on("connect", () => {
			console.log("Connected to server");
		});
	}, []);

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

						{/* Your game board */}
						<GameBoard tableOwner="player" />
					</div>
				</div>
			</main>
		</div>
	);
}