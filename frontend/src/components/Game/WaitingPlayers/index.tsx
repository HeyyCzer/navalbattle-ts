import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import { useParams } from "wouter";

export default function WaitingPlayers() {
	const { game } = useParams();

	return (
		<div className="mt-12 bg-white/5 border border-white/20 rounded-md px-6 py-6 w-fit mx-auto min-w-96">
			<h1 className="text-emerald-500 text-lg tracking-widest font-medium">Aguardando jogadores...</h1>
			<div className="text-gray-400 text-sm">
				<p>Convide seus amigos para jogar!</p>
				<p className="text-white mt-2">Compartilhe o link:</p>

				<div className="flex text-white bg-gray-800 border border-gray-700/50 rounded-lg px-2 py-2 w-auto">
					<button
						className="mr-2 bg-gray-700/50 rounded-md py-1 px-2"
						onClick={() => {
							navigator.clipboard.writeText(game ?? "ERROR");
							toast.success("Link copiado!", {
								autoClose: 2000
							});
						}}
					>
						<FontAwesomeIcon icon={faCopy} />
					</button>
					<input
						type="text"
						className="my-auto bg-transparent h-full w-full outline-none"
						value={game}
						readOnly
					/>
				</div>
			</div>
		</div>
	)
}