import { useState } from "react";
import GameBoard from "../../components/Game/Board";

export default function Game() {
	const playerName = "Jogador 1";

	const [isPlayerTurn, setIsPlayerTurn] = useState(true);

	return (
		<div className="h-full flex flex-col justify-center items-center">
			{/* Header */}
			<header className="fixed top-4 left-1/2 -translate-x-1/2 text-center">
				<h1 className="font-semibold tracking-wider uppercase text-2xl">
					<span className="text-emerald-400">Navy</span>
					War
				</h1>
				<h3>
					Partida de{" "}
					<span id="lobbyOwner" className="text-emerald-500 font-semibold">{ playerName }</span>
				</h3>
			</header>

			<main>
				<div className="flex gap-x-8">
					<div>
						<div className="text-center my-4 h-12">
							<div className={ !isPlayerTurn ? "hidden" : "" }>
								{/* Status bar */}
								<h5 className="uppercase tracking-wide text-sm font-medium text-emerald-500">É sua vez de jogar!</h5>
								<p className="text-xs text-white/80">Clique em uma coordenada para atirar</p>
							</div>
						</div>

						{/* Your game board */}
						<GameBoard tableOwner="player" />
					</div>

					{/* Opponent Game board */}
					<div>
						<div className="text-center my-4 h-12">
							<div className={ isPlayerTurn ? "hidden" : "" }>
								{/* Status bar */}
								<h5 className="uppercase tracking-wide text-sm font-medium text-red-500">Vez do oponente</h5>
								<p className="text-xs text-white/80">Aguarde enquanto seu oponente joga</p>
							</div>
						</div>

						<GameBoard tableOwner="opponent" />
					</div>
				</div>
			</main>
		</div>
	);
}