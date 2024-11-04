import { Handler } from "../interface/Handler";
import { TEAM, teamInMemory } from "../repository/TeamsInMemory";
import { Room } from "./Room";
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
		const totalPlayers = this.getTotalPlayers();
		const spectators = this.getActiveSpectatorsPlayers();
		const isNeededPlayer = this.teamControl.neededPlayersInMatch();

		if (totalPlayers.length > 4) {
			this.isValidChoose = true;
			this.isValidMatch = true;
		} else {
			this.isValidChoose = false;
			this.isValidMatch = false;
		}

		if (isNeededPlayer && !this.isValidChoose) {
			if (
				teamInMemory.getTotalPlayers() < 2 ||
				spectators.length % 2 === 0
			) {
				this.teamControl.autoAddPlayers(spectators);
			}
			return;
		}

		if (isNeededPlayer && this.isValidChoose) {
			if (this.room.getScores()) {
				this.room.pauseGame(true);
				this.isChoiceMode = true;
			}
			return;
		}
	}

	public handlerVictory(numberTeamWin: TEAM) {
		if(numberTeamWin === TEAM.BLUE) {
			this.teamControl.changeAllPlayers(TEAM.RED, TEAM.SPEC)
			this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.RED)
		} else {
			this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.SPEC)
		}
	}

	public controlAfterPlayerLeft(player: PlayerObject) {
		if (player.team !== 0) {
			this.teamControl.removePlayerTeam(player.id, player.team);

			if (
				teamInMemory.getTotalPlayers() % 2 !== 0 &&
				this.getActiveSpectatorsPlayers().length === 0
			) {
				this.teamControl.autoRemovePlayers();
			}
		}
		// TODO: tratar stats do player apos saida
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
			this.room.pauseGame(false);
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
}
