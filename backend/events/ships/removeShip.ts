import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "removeShip",
	execute(server, socket, { gameId, cell }) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayerBySocketId(socket.id);
		if (!player) return;

		const ship = player.getShip(cell);
		if (!ship) return;

		player.removeShip(cell);

		// Check if the player has the ship in their inventory
		const inventoryShip = player.inventory.ships.find(s => s.size === ship.size);
		if (!inventoryShip) return;
		
		inventoryShip.amount++;

		player.updateBoard(game);
	}
} as GameEvent;