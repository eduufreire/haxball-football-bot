import { TEAM, teamInMemory } from "../repository/TeamsInMemory";
import { CONFIG } from "../config";
import { TeamControl } from "./TeamControl";

export class GameHandler {
	public isValidChoose = false;
	public isChoiceMode = false;
	private isValidMatch = false;

	constructor(
		private room: RoomObject,
		private teamControl: TeamControl,
	) {}

	public balanceTeams() {
		setTimeout(() => {
			const totalPlayers = this.getTotalPlayers();
			if (totalPlayers.length <= CONFIG.MAX_PLAYERS_IN_MATCH) {
				const spectators = this.getActiveSpectatorsPlayers();
				let lastIndexAdd =
					spectators.length % 2 === 0
						? spectators.length
						: spectators.length - 1;
				console.log(lastIndexAdd);

				lastIndexAdd =
					lastIndexAdd === 0
						? 1
						: lastIndexAdd;
				console.log(lastIndexAdd);

				const filteredPlayers = spectators.slice(0, lastIndexAdd);
				console.log(filteredPlayers);
				this.teamControl.autoAddPlayers(filteredPlayers);

				setTimeout(() => {
					this.restartarGame();
				}, 1000);
			}
		}, 500);
	}

	public handlerVictory(numberTeamWin: TEAM) {
		if (this.getTotalPlayers().length <= CONFIG.MAX_PLAYERS_IN_MATCH) {
			this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.SPEC);
			this.teamControl.changeAllPlayers(TEAM.RED, TEAM.SPEC);
			setTimeout(() => {
				this.balanceTeams();
			}, 1000);

			setTimeout(() => {
				this.restartarGame();
			}, 2000);
		} else {
			if (numberTeamWin === TEAM.BLUE) {
				this.teamControl.changeAllPlayers(TEAM.RED, TEAM.SPEC);
				this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.RED);
			} else {
				this.teamControl.changeAllPlayers(TEAM.BLUE, TEAM.SPEC);
			}

			const spectators = this.getActiveSpectatorsPlayers();
			this.teamControl.movePlayerForTeam(spectators[0].id, TEAM.BLUE);

			setTimeout(() => {
				this.showSpectatorsPlayerForChoice();
			}, 1000);
		}
	}

	public controlAfterPlayerLeft(player: PlayerObject) {
		this.defineRoomSituation();
		if (player.team !== 0) {
			this.teamControl.removePlayerTeam(player.id, player.team);

			if (
				this.teamControl.neededPlayersInMatch() &&
				this.getTotalPlayers().length > CONFIG.MAX_PLAYERS_IN_MATCH
			) {
				this.showSpectatorsPlayerForChoice();
				return;
			}

			if (this.getTotalPlayers().length < CONFIG.MAX_PLAYERS_IN_MATCH) {
				this.teamControl.autoRemovePlayers();
				return;
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

		let message = "Digite o NÚMERO do jogador para escolhê-lo\n";
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
		return this.room.getPlayerList().filter((p) => p.id !== 0 && p.id !== 1);
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
		this.isChoiceMode =
			totalPlayers.length > CONFIG.MAX_PLAYERS_IN_MATCH &&
			this.teamControl.neededPlayersInMatch();
		this.isValidMatch =
			teamInMemory.getTotalPlayers() === CONFIG.MAX_PLAYERS_IN_MATCH;

		if (this.isChoiceMode) {
			this.stopGame();
		}
	}

	public restartarGame() {
		if (
			teamInMemory.getTotalPlayers() === CONFIG.MAX_PLAYERS_IN_MATCH &&
			(!this.room.getScores() || this.room.getScores().time <= 15)
		) {
			this.room.stopGame();
			this.room.startGame();
		}
	}
}
