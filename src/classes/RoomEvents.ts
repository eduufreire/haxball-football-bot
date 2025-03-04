import { CONFIG } from "../config";
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
		};

		room.onGameTick = () => {
			gameHandler.defineRoomSituation();
		}

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
				let losers = [];
				let winners = [];
				if (scores.blue > scores.red) {
					losers = teamControl.getPlayers(CONFIG.TEAMS.RED_NUMBER);
					winners = teamControl.getPlayers(CONFIG.TEAMS.BLUE_NUMBER);
					gameHandler.handlerVictory(2);
				} else {
					losers = teamControl.getPlayers(CONFIG.TEAMS.BLUE_NUMBER);
					winners = teamControl.getPlayers(CONFIG.TEAMS.RED_NUMBER);
					gameHandler.handlerVictory(1);
				}

				for (const element of losers) {
					playerControl.updateStats(element,"defeats");
					playerControl.updateStats(element,"matches");
				}

				for (const element of winners) {
					playerControl.updateStats(element,"victories");
					playerControl.updateStats(element,"matches");
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
			const time = Commons.formaterTimer(room.getScores().time);
			let messageAnnouncementGoal = "";

			if (team === teamPlayerGoal) {
				playerControl.updateStats(idPlayerGoal, "goals");
				messageAnnouncementGoal = `[${time}] >> ⚽ GOL ${nameGoal}`;

				if (lastsPlayerBallKick[1]) {
					const {
						id: idPlayerAssistence,
						playerTeam: teamPlayerAssistence,
						name: nameAssistence,
					} = lastsPlayerBallKick[1];

					if (
						team === teamPlayerAssistence &&
						idPlayerAssistence !== idPlayerGoal
					) {
						playerControl.updateStats(
							idPlayerAssistence,
							"assistences",
						);
						messageAnnouncementGoal += ` | 🤝 Assitência milimétrica: ${nameAssistence}`;
					}
				}
				room.sendAnnouncement(
					messageAnnouncementGoal,
					undefined,
					0xeaf272,
					"bold",
					2,
				);
				return;
			}

			messageAnnouncementGoal = `[${time}] >> ⚽❌ GOL CONTRA ${nameGoal}`;
			room.sendAnnouncement(
				messageAnnouncementGoal,
				undefined,
				0xeaf272,
				"bold",
				2,
			);
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
