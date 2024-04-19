import { lazy } from "react";
import { Route, Switch, Router as WouterRouter } from "wouter";

const Home = lazy(() => import("./pages/Home"));
const Game = lazy(() => import("./pages/Game"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function Router() {
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
