import { useState } from "react";
import GameBoard from "../../components/Game/Board";

export default function Game() {
	const playerName = "Jogador 1";

	const [isPlayerTurn, setIsPlayerTurn] = useState(true);

	return (
		<div className="flex flex-col">
			{/* Header */}
			<div className="text-center py-6">
				<h1 className="font-semibold tracking-wider uppercase text-2xl">
					<span className="text-emerald-400">Navy</span>
					War
				</h1>
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