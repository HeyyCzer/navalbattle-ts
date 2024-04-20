import Logo from "../Logo";

export default function Connecting() {
	return (
		<div className="h-screen w-screen">
			<div className="flex h-full w-full items-center justify-center">
				<div className="text-center">
					<Logo />
					<p className="text-2xl text-center">Conectando ao servidor...</p>

					<div className="flex justify-center mt-8">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
					</div>
				</div>
			</div>
		</div>
	)
}