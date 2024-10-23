import { Handler } from "../interface/Handler";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameHandler implements Handler {

	public isValidChoose = false
	public isChoiceMode = false
	private isValidMatch = false

	constructor(
		private room: RoomObject,
		private teamControl: TeamControl,
	) { }

	public handler(): void {
		const totalPlayers = 
			this.room.getPlayerList()
			.filter((p) => p.id !== 0);

		const spectators = totalPlayers.filter(p => p.team === 0);
		const playersInMatch = this.teamControl.totalPlayersInMatch()
		
		if(totalPlayers.length > 4) {
			this.isValidChoose = true
			this.isValidMatch = true
		} else {
			this.isValidChoose = false
			this.isValidMatch = false
		}

		if (playersInMatch < 4 && !this.isValidChoose) {
			this.teamControl.autoAddPlayers(spectators)
			return;
		} 
		
		if (playersInMatch < 4 && this.isValidChoose) {
			if (this.room.getScores()) {
				this.room.pauseGame(true)
				this.isChoiceMode = true
			}
			return;
		}
	}

	public controlAfterPlayerLeft(player: PlayerObject) {
		if(player.team !== 0 ) {
			this.teamControl.removePlayerTeam(player.id, player.team);
		}
		console.log('saiu')
		// TODO: tratar stats do player apos saida
	}

	public verifyIsChoiceMode(): boolean {
		return this.isChoiceMode
	}

	public choicePlayerForTeam(
	  playerChoiced: number,
	  idCaptain: number,
	  team: number
	): void {
		console.log('escolheu')
	//   let spectatorsPlayers = this.getActiveSpecPlayers();

	//   if (!this.verifyIndexIsValid(playerChoiced)) {
	//     let invalidIndexMessage = `O número digitado é inválido para escolha`;
	//     this.room.sendAnnouncement(
	//       invalidIndexMessage,
	//       idCaptain,
	//       0xd9554c,
	//       "bold",
	//       1
	//     );
	//     this.showSpectatorsPlayerForChoice();
	//     return;
	//   }

	//   let idPlayer = spectatorsPlayers[playerChoiced - 1].id;
	//   this.teamControl.movePlayerForTeam(idPlayer, team);

	//   let missingPlayers = this.teamControl.getMissingPlayersFromMatch();
	//   if (missingPlayers === 0) {
	//     this.disablePlayerChoiceMode();
	//     this.updateTeamCaptains();
	//   }
	}

	public showSpectatorsPlayerForChoice() {
		this.room.sendAnnouncement('modo escolha', 1)
	}
	// 	this.updateTeamCaptains();
	// 	let spectatorsPlayers = this.getActiveSpecPlayers();

	// 	let message = `Digite o NÚMERO do jogador OU !rand / !top / !bottom \n\n`;
	// 	message += `Jogadores disponíveis para escolha: \n`;

	// 	spectatorsPlayers.forEach((player, index) => {
	// 	if (index === spectatorsPlayers.length - 1) {
	// 		message += `${player.name}[${index + 1}]`;
	// 		return;
	// 	}
	// 	message += `${player.name}[${index + 1}], `;
	// 	});

	// 	let idCaptain =
	// 	this.verifyPreferenceChoice() === CONSTANTS.TEAMS.RED_NUMBER
	// 		? this.teamCaptains?.redID
	// 		: this.teamCaptains?.blueID;
	// 	this.room.sendAnnouncement(message, idCaptain, 0xe8a157, "bold", 1);
	// }

	// public getActiveSpecPlayers(): Array<PlayerObject> {
	//   // TODO: futuramente, aplicar filtro também para pessoas ausentes
	//   return this.room.getPlayerList().filter((p) => p.id != 0 && p.team === 0);
	// }

	// public verifyIsChoiceMode(): boolean {
	//   return this.isChoiceMode;
	// }

	// public getCaptains(): TeamCaptains | null {
	//   return this.teamCaptains;
	// }

	// public verifyPreferenceChoice(): number {
	//   return this.teamControl.verifyCaptainWithPreferenceChoice();
	// }

	// public quantidadeDePessoas() {
	//   return this.teamControl.getMissingPlayersFromMatch()
	// }

	// private verifyIndexIsValid(index: number) {
	//   let activePlayers = this.getActiveSpecPlayers();
	//   if (index < 0 || index > activePlayers.length) {
	//     return false;
	//   }
	//   return true;
	// }

	// private restartGame(): void {
	//   this.room.stopGame();
	//   setTimeout(() => {
	//     this.room.startGame();
	//   }, 1000);
	// }

	// public handlerVictoryTeam(redScores: number, blueScores: number) {
	//   this.room.stopGame()

	//   let winTeam = 0;
	//   let loserTeam = 0;

	//   if (redScores > blueScores) {
	//     winTeam = CONSTANTS.TEAMS.RED_NUMBER
	//     loserTeam = CONSTANTS.TEAMS.BLUE_NUMBER
	//   } else {
	//     winTeam = CONSTANTS.TEAMS.BLUE_NUMBER
	//     loserTeam = CONSTANTS.TEAMS.RED_NUMBER
	//   }

	//   this.teamControl.moveLoserPlayers(loserTeam)
	//   this.teamControl.moveWinPlayers(winTeam)

	//   let activePlayers = this.getActiveSpecPlayers();
	//   this.room.setPlayerTeam(activePlayers[0].id, 2);
	//   this.enablePlayerChoiceMode()
	// }
}
