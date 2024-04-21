import Ship from "../../classes/entities/ship";
import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "placeShip",
	execute(server, socket, { gameId, origin, size, orientation }) {
		const game = getGame(gameId);
		if (!game) return;

		const player = game.getPlayerBySocketId(socket.id);
		if (player) {
			// Check if the ship can be placed
			const cells = new Ship(origin, size, orientation).cells;
			for (const cell of cells) {
				for (const ship of player.ships) {
					if (ship.cells.includes(cell)) {
						return;
					}
				}
			}

			const breaksLine = cells.some((cell, i) => {
				if (i === 0) return false;
				return orientation === "H" ? cell % game.board.columns === 0 : false;
			});
			const isOutOfBoard = game.board.columns * game.board.rows < size;
			if (breaksLine || isOutOfBoard) return;

			// Check if the player has the ship in their inventory
			const inventoryShip = player.inventory.ships.find(ship => ship.size === size);
			if (!inventoryShip || inventoryShip.amount <= 0) return;
			
			inventoryShip.amount--;

			// Place the ship
			player.placeShip(origin, size, orientation);
			player.updateBoard(game);
		}
	}
} as GameEvent;