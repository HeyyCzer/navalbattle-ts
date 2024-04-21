import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "wouter";
import Logo from "../Logo";

export default function Navbar() {
	return (
		<nav className="py-6 px-12 grid grid-cols-3 gap-y-2 border-b border-white/5">
			<Link href="/" className="order-1">
				<Logo />
			</Link>

			<div className="flex justify-center gap-x-4 text-gray-400 sm:order-2 order-3 col-span-full sm:col-span-1">
				<Link href="#about">
					Aprenda a jogar
				</Link>
			</div>

			<div className="flex justify-end order-2 sm:order-3 col-span-2 sm:col-span-1">
				<Link href="https://github.com/heyyczer/navalbattle-ts" target="_blank" rel="noopener noreferrer">
					<FontAwesomeIcon icon={faGithub} />
				</Link>
			</div>
		</nav>
	)
}