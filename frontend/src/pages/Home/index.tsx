import { Link } from "wouter";
import Logo from "../../components/Logo";

export default function Home() {
	return (
		<div>
			<div className="py-6 px-12 grid grid-cols-2">
				<div>
					<Logo />
				</div>

				<div>
					<Link href="#about">
						Aprenda a jogar
					</Link>
					<Link href="/">
						
					</Link>
				</div>
			</div>
		</div>
	);
}