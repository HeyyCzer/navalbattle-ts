import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WaitingPlayers() {
	return (
		<div className="bg-white/5 border border-white/20 rounded-md px-8 py-6">
			<h1 className="text-emerald-500 text-lg tracking-widest font-medium">Aguardando jogadores...</h1>
			<div className="text-gray-400">
				<p>Convide seus amigos para jogar!</p>
				<p className="text-white mt-2">Compartilhe o link:</p>

				<div className="flex text-white bg-gray-800 border border-gray-700/50 rounded-lg px-2 py-2 w-96">
					<button
						className="mr-2 bg-gray-700/50 rounded-md py-1 px-2"
						onClick={() => {
							navigator.clipboard.writeText(window.location.href);
						}}
					>
						<FontAwesomeIcon icon={faCopy} />
					</button>
					<input
						type="text"
						className="my-auto bg-transparent h-full w-full outline-none"
						value={window.location.href}
						readOnly
					/>
				</div>
			</div>
		</div>
	)
}