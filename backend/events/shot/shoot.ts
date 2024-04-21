import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "shoot",
	execute(server, socket, { gameId, cell }) {
		const game = getGame(gameId);
		if (!game) return; // Game not found
		if (!game.isPlaying) return; // Game not started

		const player = game.getPlayerBySocketId(socket.id);
		if (!player || player.alreadyShot) return; // Player not found or already shot
		if (game.currentPlayer?.id !== player.id) return; // Not your turn
		if (player.shots.includes(cell)) return; // Already shot in this cell

		player.alreadyShot = true;
		player.addShot(cell);

		game.updateRender();

		game.checkConditions("game_over");

		if (!game.isFinished) {
			setTimeout(() => {
				game.nextPlayer();
			}, 5000);
		}
	},
} as GameEvent;