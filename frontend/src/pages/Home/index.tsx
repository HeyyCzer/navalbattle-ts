import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { Link } from "wouter";
import Logo from "../../components/Logo";
import useSocketStore from "../../components/Socket/store";

const boardSizes = [
	{
		size: "8x8",
		description: "Pequeno e Rápido",
		columns: 8,
		rows: 8
	},
	{
		size: "10x10",
		description: "Padrão", 
		columns: 10, 
		rows: 10
	},
	{
		size: "12x12",
		description: "Grande e Desafiador", 
		columns: 12, 
		rows: 12
	},
];

export default function Home() {
	const [boardSize, setBoardSize] = useState("8x8");

	const socket = useSocketStore(state => state.socket);
	
	const handleCreateGame = async (size: string) => {
		const board = boardSizes.find(board => board.size === size);
		if (!board || !socket) return;

		socket.emit("createGame", board.columns, board.rows)
	};

	return (
		<div>
			<nav className="py-6 px-12 grid grid-cols-3">
				<div>
					<Logo />
				</div>

				<div className="flex justify-center gap-x-4 text-gray-400">
					<Link href="#about">
						Aprenda a jogar
					</Link>
				</div>

				<div className="flex justify-end">
					<Link href="https://github.com/heyyczer/navalbattle-ts" target="_blank" rel="noopener noreferrer">
						<FontAwesomeIcon icon={faGithub} />
					</Link>
				</div>
			</nav>

			<div className="py-12">
				<div className="px-8 py-6 rounded-md mx-auto w-fit border border-white/20 bg-white/5">
					<div className="text-center">
						<h1 className="text-lg font-medium trakcing-widest">Criar uma partida</h1>
						<p className="text-white/60">Configure a partida e envie o link para um jogador!</p>
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
											className={twMerge("flex flex-col border border-emerald-500/20 bg-emerald-500/10 py-3 px-4 rounded-lg", size === boardSize && "bg-emerald-500/40 border-emerald-500/60")}
										>
											<h1 className="my-auto text-4xl text-center">{size}</h1>
											<span className="text-center text-xs text-white/80 mt-2">{description}</span>
										</div>
									))
								}
							</div>
						</div>

						<button
							onClick={() => handleCreateGame(boardSize)}	
							className="mx-auto bg-emerald-500 rounded-lg px-4 py-2"
						>
							Criar partida
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}