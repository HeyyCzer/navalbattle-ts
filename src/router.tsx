import { Route, Switch, Router as WouterRouter } from "wouter";
import Game from "./pages/Game";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";

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
