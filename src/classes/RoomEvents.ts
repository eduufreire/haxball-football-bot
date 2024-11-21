import { teamInMemory } from "../repository/TeamsInMemory";
import { GameHandler } from "./GamerHandler";
import { RoomConfig } from "./RoomConfig";
import { TeamControl } from "./TeamControl";

export default class RoomEvents {
	private constructor() {}

	static listenEvents(room: RoomObject) {
		const teamControl = new TeamControl(room, teamInMemory);
		const gameHandler = new GameHandler(room, teamControl);

		room.onRoomLink = (link: string) => {
			console.log(link);
			room.startGame();
			setInterval(() => {
				gameHandler.defineRoomSituation()
			}, 1000)
		};

		room.onPlayerJoin = (player: PlayerObject) => {
			room.sendAnnouncement(".................BOT EM FASE DE TESTE, PODE CONTER VÁRIOS BUGS...............", player.id, 0x8f77bd, "bold", 1)
			gameHandler.balanceTeams();
		};

		room.onPlayerLeave = (player: PlayerObject) => {
			gameHandler.controlAfterPlayerLeft(player);
			gameHandler.balanceTeams();
		};

		room.onTeamVictory = (scores: ScoresObject) => {
			setTimeout(() => {
				room.stopGame()
				if (scores.blue > scores.red) {
					gameHandler.handlerVictory(2);
				} else {
					gameHandler.handlerVictory(1);
				}
			}, 2000)
		};

		room.onPlayerChat = (player, msg) => {
			const isCaptain =
				player.id === teamInMemory.getCaptainTeam(1) ||
				player.id === teamInMemory.getCaptainTeam(2);
			if (gameHandler.verifyIsChoiceMode() && isCaptain) {
				if (teamInMemory.verifyPreferenceTeam() !== player.team) {
					return true;
				}

				if (verifyMessageIsNumber(msg)) {
					gameHandler.choicePlayerForTeam(
						Number.parseInt(msg),
						player.id,
						player.team,
					);
					return false;
				}
			}

			if (msg.startsWith("##")) {
				room.setPlayerAdmin(player.id, true);
				return false;
			}
			return true;
		};
	}
}


function verifyMessageIsNumber(msg: string) {
	const regex = /^[0-9]{1,}$/;
	return regex.test(msg);
}
