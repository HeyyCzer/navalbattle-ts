import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "removeShip",
	execute(server, client, { gameId, cell }) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayerBySocketId(client.id);
		if (!player) return;

		const ship = player.getShip(cell);
		if (!ship) {
			client.emit("showToast", {
				type: "error",
				message: "Não existe um navio nessa posição!"
			});
			return;
		}

		// Check if the player has the ship in their inventory
		const inventoryShip = player.inventory.ships.find(s => s.size === ship.size);
		if (!inventoryShip) {
			client.emit("showToast", {
				type: "error",
				message: "Você não tem mais navios desse tipo!"
			});
			return;
		}

		inventoryShip.amount++;

		player.removeShip(cell);

		player.updateBoard(game);
	}
} as GameEvent;