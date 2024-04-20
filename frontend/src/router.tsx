// import { lazy } from "react";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Route, Switch, Router as WouterRouter } from "wouter";
import { navigate } from "wouter/use-browser-location";
import Connecting from "./components/Connecting";
import useSocketStore from "./components/Socket/store";
import Game from "./pages/Game";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

// const Home = lazy(() => import("./pages/Home"));
// const Game = lazy(() => import("./pages/Game"));
// const NotFound = lazy(() => import("./pages/NotFound"));

export default function Router() {
	const [connected, setConnected] = useState(false);

	const { socket, setSocket } = useSocketStore((state: any) => state);

	useEffect(() => {
		localStorage.debug = '*';

		const socket = io(import.meta.env.VITE_SOCKET_SERVER, {
			reconnectionDelayMax: 2000,
		});

		socket.on("connect", () => {
			console.log("Connected to server");
			setConnected(true);
		});

		socket.on("disconnect", () => {
			console.log("Disconnected from server");
			setConnected(false);
		});

		socket.on("gameCreated", (game: any) => {
			navigate(`/game/${game.id}`);
		});

		setSocket(socket);

		return () => {
			socket.disconnect();
		};
	}, []);

	if (!connected) {
		return (
			<Connecting />
		);
	}

	return (
		<WouterRouter>
			<Switch>
				<Route path="/" component={Home} />
				<Route path="/game/:game" component={Game} />
				<Route path="*" component={NotFound} />
			</Switch>
		</WouterRouter>
	)
}
