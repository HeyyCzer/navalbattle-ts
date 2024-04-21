import { faHashtag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { navigate } from "wouter/use-browser-location";
import Navbar from "../../components/Navbar";
import useSocketStore from "../../components/Socket/store";

const boardSizes = [
	// {
	// 	size: "8x8",
	// 	description: "Pequeno e Rápido",
	// 	columns: 8,
	// 	rows: 8
	// },
	{
		size: "10x10",
		description: "Padrão e Equilibrado",
		columns: 10,
		rows: 10,
		default: true
	},
	// {
	// 	size: "12x12",
	// 	description: "Grande e Desafiador", 
	// 	columns: 12, 
	// 	rows: 12
	// },
];

export default function Home() {
	const socket = useSocketStore(state => state.socket);

	const [gameId, setGameId] = useState<string>("");
	const [boardSize, setBoardSize] = useState(boardSizes.find(board => board.default)?.size || boardSizes[0].size);

	const handleCreateGame = async (size: string) => {
		const board = boardSizes.find(board => board.size === size);
		if (!board || !socket) return;

		socket.emit("createGame", {
			columns: board.columns,
			rows: board.rows
		})
	};

	return (
		<div>
			<Navbar />

			<div className="px-4 lg:py-12 mx-auto space-y-8 w-fit">
				<div className="px-4 lg:px-8 py-6 rounded-md mx-auto border border-white/20 bg-white/5 w-auto">
					<div className="text-center">
						<h1 className="text-lg font-medium trakcing-widest">Criar uma partida</h1>
						<p className="text-white/60 text-wrap">Configure a partida e envie o link para um jogador!</p>
					</div>

					<div className="flex flex-col gap-y-4 mt-6">
						{/* Board size */}
						<div>
							<h1 className="text-white/80 text-center mb-2">Tamanho do tabuleiro</h1>
							<div className="grid grid-cols-3 gap-x-2">
								{
									boardSizes.map(({ size, description }, index) => (
										<div
											key={index}
											onClick={() => setBoardSize(size)}
											className={twMerge("flex flex-col justify-between border border-emerald-500/20 bg-emerald-500/10 py-3 px-2 rounded-lg transition-colors", size === boardSize && "bg-emerald-500/40 border-emerald-500/60")}
										>
											<h1 className="text-2xl 2xl:text-4xl text-center">{size}</h1>
											<span className="text-center text-xs text-white/80">{description}</span>
										</div>
									))
								}
							</div>
						</div>

						<button
							onClick={() => handleCreateGame(boardSize)}
							className="mx-auto bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-lg px-4 py-2"
						>
							Criar partida
						</button>
					</div>
				</div>

				<div className="px-4 lg:px-8 py-6 rounded-md mx-auto border border-white/20 bg-white/5 w-auto">
					<div className="text-center">
						<h1 className="text-lg font-medium trakcing-widest">Entrar numa partida</h1>
						<p className="text-white/60 text-wrap">Insira o código da partida abaixo para entrar!</p>
					</div>

					<div className="flex flex-col gap-y-4 mt-6">
						<div className="flex text-white bg-gray-800 border border-gray-700/50 rounded-lg px-2 py-2 w-auto">
							<span
								className="mr-2 bg-gray-700/50 rounded-md py-1 px-2"
							>
								<FontAwesomeIcon icon={faHashtag} />
							</span>
							
							<input
								type="text"
								className="my-auto bg-transparent w-full outline-none"
								value={gameId}
								placeholder="Código da partida"
								onChange={e => setGameId(e.target.value)}
								maxLength={5}
								minLength={5}
							/>
						</div>

						<button
							onClick={() => gameId && navigate(`/game/${gameId}`)}
							className="mx-auto bg-emerald-500 hover:bg-emerald-600 transition-colors rounded-lg px-4 py-2"
						>
							Entrar na partida
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}