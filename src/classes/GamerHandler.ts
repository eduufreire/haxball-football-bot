import { Handler } from "../interface/Handler";
import { TEAM, teamInMemory } from "../repository/TeamsInMemory";
import { CONSTANTS } from "../utils/constants";
import { TeamControl } from "./TeamControl";

export class GameHandler implements Handler {
	public isValidChoose = false;
	public isChoiceMode = false;
	private isValidMatch = false;

	constructor(
		private room: RoomObject,
		private teamControl: TeamControl,
	) {}

	public handler(): void {
		const spectators = this.getActiveSpectatorsPlayers();
		const isNeededPlayer = this.teamControl.neededPlayersInMatch();
		const MAX_PLAYERS = CONSTANTS.MAX_PLAYERS_IN_MATCH;

		if (isNeededPlayer && !this.isValidChoose) {
			if (
				teamInMemory.getTotalPlayers() <= MAX_PLAYERS &&
				(this.getTotalPlayers().length % 2 === 0 ||
					this.getTotalPlayers().length <
						CONSTANTS.MIN_PLAYERS_IN_MATCH)
			) {
				this.teamControl.autoAddPlayers(spectators);
			}

			if (
				teamInMemory.getTotalPlayers() === MAX_PLAYERS &&
				!this.isValidMatch
			) {
				this.restartarGame();
			}
			// if (
			// 	teamInMemory.getTotalPlayers() <= MAX_PLAYERS &&
			// 	(this.getTotalPlayers().length % 2 === 0 ||
			// 		this.getTotalPlayers().length <
			// 			CONSTANTS.MIN_PLAYERS_IN_MATCH)
			// ) {
			// 	this.teamControl.autoAddPlayers(spectators);

			// 	if (
			// 		teamInMemory.getTotalPlayers() === MAX_PLAYERS &&
			// 		!this.isValidMatch
			// 	) {
			// 		this.restartarGame();
			// 	}
			// }
		}

		if (isNeededPlayer && this.isValidChoose) {
			this.stopGame();
			this.isChoiceMode = true;
		}

		this.defineRoomSituation();
	}

	public handlerVictory(numberTeamWin: TEAM) {
		let spectators: PlayerObject[];
		if (this.getTotalPlayers().length <= CONSTANTS.MAX_PLAYERS_IN_MATCH) {
			this.teamControl.changeAllPlayers(TEAM.RED, TEAM.SPEC);
			this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.SPEC);
			setTimeout(() => {
				this.restartarGame();
			}, 1000);
		} else {
			if (numberTeamWin === TEAM.BLUE) {
				this.teamControl.changeAllPlayers(TEAM.RED, TEAM.SPEC);
				this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.RED);
			} else {
				this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.SPEC);
			}

			setTimeout(() => {
				spectators = this.getActiveSpectatorsPlayers();
				this.teamControl.movePlayerForTeam(spectators[0].id, TEAM.BLUE);
				this.showSpectatorsPlayerForChoice();
			}, 1000);
		}
	}

	public controlAfterPlayerLeft(player: PlayerObject) {
		this.defineRoomSituation();

		if (player.team !== 0) {
			this.teamControl.removePlayerTeam(player.id, player.team);

			if (
				teamInMemory.getTotalPlayers() % 2 !== 0 &&
				this.getActiveSpectatorsPlayers().length === 0
			) {
				this.teamControl.autoRemovePlayers();
			}
		}
	}

	public choicePlayerForTeam(
		playerChoiced: number,
		idCaptain: number,
		team: number,
	): void {
		const spectators = this.getActiveSpectatorsPlayers();

		if (playerChoiced < 0 || playerChoiced > spectators.length) {
			const invalidIndexMessage =
				"O número digitado é inválido para escolha";
			this.room.sendAnnouncement(
				invalidIndexMessage,
				idCaptain,
				0xd9554c,
				"bold",
				1,
			);
			this.showSpectatorsPlayerForChoice();
			return;
		}

		const idPlayer = spectators[playerChoiced - 1].id;
		this.teamControl.movePlayerForTeam(idPlayer, team);

		const isNeededPlayer = this.teamControl.neededPlayersInMatch();
		if (isNeededPlayer) {
			this.showSpectatorsPlayerForChoice();
		} else {
			this.isChoiceMode = false;
			this.startGame();
		}
	}

	public showSpectatorsPlayerForChoice() {
		const spectators = this.getActiveSpectatorsPlayers();

		let message =
			"Digite o NÚMERO do jogador OU !rand / !top / !bottom \n\n";
		message += "Jogadores disponíveis para escolha: \n";

		spectators.forEach((player, index) => {
			if (index === spectators.length - 1) {
				message += `${player.name}[${index + 1}]`;
				return;
			}
			message += `${player.name}[${index + 1}], `;
		});

		const team = this.teamControl.verifyCaptainWithPreferenceChoice();
		const idCaptain = teamInMemory.getCaptainTeam(team);
		this.room.sendAnnouncement(message, idCaptain, 0xe8a157, "bold", 1);
	}

	public getTotalPlayers(): Array<PlayerObject> {
		return this.room.getPlayerList().filter((p) => p.id !== 0);
	}

	public getActiveSpectatorsPlayers(): Array<PlayerObject> {
		return this.getTotalPlayers().filter((p) => p.team === 0);
	}

	public verifyIsChoiceMode(): boolean {
		return this.isChoiceMode;
	}

	public startGame() {
		if (this.room.getScores()) {
			this.room.pauseGame(false);
		} else {
			this.room.startGame();
		}
	}

	public stopGame() {
		if (this.room.getScores()) {
			this.room.pauseGame(true);
		} else {
			this.room.stopGame();
		}
	}

	public defineRoomSituation() {
		const totalPlayers = this.getTotalPlayers();
		this.isValidChoose =
			totalPlayers.length > CONSTANTS.MAX_PLAYERS_IN_MATCH;
		this.isValidMatch =
			teamInMemory.getTotalPlayers() === CONSTANTS.MAX_PLAYERS_IN_MATCH;
	}

	public restartarGame() {
		this.room.stopGame();
		this.room.startGame();
	}
}
