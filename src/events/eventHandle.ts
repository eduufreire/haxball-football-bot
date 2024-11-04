import { GameHandler } from "../classes/GamerHandler";
import { Room } from "../classes/Room";
import { TeamControl } from "../classes/TeamControl";
import { Timer } from "../classes/Timer";
import { TeamCaptains } from "../interface/Handler";
import { teamInMemory } from "../repository/TeamsInMemory";

export default function playerChat() {
	const room = Room.getRoom();
	const teamControl = new TeamControl(room, teamInMemory);
	const gameControl = new GameHandler(room, teamControl);
	const timer = new Timer(gameControl);

	room.onRoomLink = (link) => {
		console.log(link);
		room.startGame();
		timer.startTimer(1500);
	};

	room.onPlayerJoin = (player) => {
		if (gameControl.isChoiceMode) {
			gameControl.showSpectatorsPlayerForChoice();
		}
	};

	room.onPlayerLeave = (player) => {
		if (gameControl.isChoiceMode) {
			gameControl.showSpectatorsPlayerForChoice();
		}
		gameControl.controlAfterPlayerLeft(player);
	};

	room.onGamePause = (byPlayer) => {
		if (gameControl.isChoiceMode) {
			gameControl.showSpectatorsPlayerForChoice();
		}
	};

	room.onPlayerChat = (player, msg) => {
		const isCaptain =
			player.id === teamInMemory.getCaptainTeam(1) ||
			player.id === teamInMemory.getCaptainTeam(2);
		if (gameControl.verifyIsChoiceMode() && isCaptain) {
			if (teamInMemory.verifyPreferenceTeam() !== player.team) {
				return true;
			}

			if (verifyMessageIsNumber(msg)) {
				gameControl.choicePlayerForTeam(
					Number.parseInt(msg),
					player.id,
					player.team,
				);
				return false;
			}
		}

		if (msg.startsWith("#")) {
			room.setPlayerAdmin(player.id, true);

			return false;
		}

		return true;
	};

	room.onTeamVictory = (scores) => {
		console.log(scores)
		if (scores.blue > scores.red) {
			gameControl.handlerVictory(2)
		} else {
			console.log('red')
			gameControl.handlerVictory(1)
		}
	}


	// room.onGameTick = () => {
	//   if (gameControl.quantidadeDePessoas() === 0) {
	//     timer.stopTimer();
	//   }
	//   captains = gameControl.getCaptains();
	// };
}

function verifyMessageIsNumber(msg: string) {
	const regex = /^[0-9]{1,}$/;
	return regex.test(msg);
}
