import { getGame } from "../../controller/game.controller";
import { GameEvent } from "../../event";

export default {
	name: "shoot",
	execute(server, socket, { gameId, cell }) {
		const game = getGame(gameId);
		if (!game) return; // Game not found
		if (!game.isPlaying) return; // Game not started

		const player = game.getPlayerBySocketId(socket.id);
		if (!player) return;

		if (player.alreadyShot) {
			socket.emit("showToast", {
				type: "error",
				message: "Você já atirou nessa rodada!"
			});
			return;
		}

		if (game.currentPlayer?.id !== player.id) {
			socket.emit("showToast", {
				type: "error",
				message: "Aguarde a sua vez de atirar!"
			});
			return;
		}

		if (player.shots.includes(cell)) {
			socket.emit("showToast", {
				type: "error",
				message: "Você já atirou nessa posição!"
			});
			return;
		}

		const targetPlayer = game.players.find(p => p.id !== player.id);
		if (!targetPlayer) return;

		const isHit = targetPlayer.ships.some(ship => ship.cells.includes(cell));

		player.alreadyShot = !isHit;
		player.addShot(cell);

		game.updateRender();

		game.checkConditions("game_over");

		if (!game.isFinished && !isHit) {
			setTimeout(() => {
				game.nextPlayer();
			}, 5000);
		} else if (isHit) {
			socket.emit("showToast", {
				type: "success",
				message: "Você acertou, atire novamente!"
			});
		}
	},
} as GameEvent;