import { TEAM, teamInMemory } from "../repository/TeamsInMemory";
import Commons from "../utils/commons";
import { GameHandler } from "./GamerHandler";
import PlayerControl from "./PlayerControl";
import { TeamControl } from "./TeamControl";

type ControlBallTouche = {
	id: number;
	name: string;
	playerTeam: number;
};
export default class RoomEvents {
	private constructor() {}

	static listenEvents(room: RoomObject) {
		const teamControl = new TeamControl(room, teamInMemory);
		const gameHandler = new GameHandler(room, teamControl);
		const playerControl = new PlayerControl();
		const lastsPlayerBallKick: Array<ControlBallTouche> = [];

		room.onRoomLink = (link: string) => {
			console.log(link);
			room.startGame();
			setInterval(() => {
				gameHandler.defineRoomSituation();
			}, 500);
		};

		room.onPlayerJoin = (player: PlayerObject) => {
			playerControl.initializerPlayer(player);
			gameHandler.hasShowPlayers();

			room.sendAnnouncement(
				".................BOT EM FASE DE TESTE, PODE CONTER VÁRIOS BUGS...............",
				player.id,
				0x8f77bd,
				"bold",
				1,
			);

			gameHandler.balanceTeams();
		};

		room.onPlayerLeave = (player: PlayerObject) => {
			playerControl.saveAndRemovePlayersStats(player.id);
			gameHandler.hasShowPlayers();
			gameHandler.controlAfterPlayerLeft(player);
			gameHandler.balanceTeams();
		};

		room.onTeamVictory = (scores: ScoresObject) => {
			setTimeout(() => {
				room.stopGame();
				if (scores.blue > scores.red) {
					gameHandler.handlerVictory(2);
				} else {
					gameHandler.handlerVictory(1);
				}
			}, 2000);
		};

		room.onPlayerTeamChange = (
			changedPlayer: PlayerObject,
			byPlayer: PlayerObject,
		) => {
			if (byPlayer.id !== 0) {
				teamControl.autoReorganizeTeams(TEAM.RED);
				teamControl.autoReorganizeTeams(TEAM.BLUE);
			}
			gameHandler.balanceTeams();
		};

		room.onPlayerBallKick = (player: PlayerObject) => {
			lastsPlayerBallKick[1] = lastsPlayerBallKick[0];
			lastsPlayerBallKick[0] = {
				id: player.id,
				playerTeam: player.team,
				name: player.name,
			};
		};

		room.onTeamGoal = (team: TEAM) => {
			const {
				id: idPlayerGoal,
				playerTeam: teamPlayerGoal,
				name: nameGoal,
			} = lastsPlayerBallKick[0];
			const {
				id: idPlayerAssistence,
				playerTeam: teamPlayerAssistence,
				name: nameAssistence,
			} = lastsPlayerBallKick[1];

			if (team === teamPlayerGoal) {
				playerControl.updateStats(idPlayerGoal, "goals");

				if (
					team === teamPlayerAssistence &&
					idPlayerAssistence !== idPlayerGoal
				) {
					playerControl.updateStats(
						idPlayerAssistence,
						"assistences",
					);
				}

				const message = `Gol feito por: ${nameGoal}`;
				room.sendAnnouncement(message, undefined, 0xfffff, "bold", 2);
			}
		};

		room.onPlayerChat = (player, msg) => {
			const isCaptain = teamControl.verifyIsCaptain(player.id);
			if (isCaptain && gameHandler.verifyIsChoiceMode()) {
				if (
					teamControl.verifyCaptainWithPreferenceChoice() !==
					player.team
				) {
					return true;
				}

				if (Commons.verifysNumber(msg)) {
					gameHandler.choicePlayerForTeam(
						Number.parseInt(msg),
						player.id,
						player.team,
					);
					return false;
				}
			}

			if (msg.startsWith("##@@")) {
				room.setPlayerAdmin(player.id, true);
				return false;
			}
			return true;
		};
	}
}
