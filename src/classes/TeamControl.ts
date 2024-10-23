import { CONSTANTS } from "../utils/constants";
import { Room } from "./Room";
import {
	TEAM,
	teamInMemory,
	TeamRepository,
} from "../repository/TeamsInMemory";

export class TeamControl {
	constructor(
		private room: RoomObject,
		private teamRepository: TeamRepository,
	) {}

	public movePlayerForTeam(idPlayer: number, numberTeam: TEAM): void {
		this.room.setPlayerTeam(idPlayer, numberTeam);
		this.teamRepository.addPlayerTeam(idPlayer, numberTeam);
	}

	public autoAddPlayers(playersInQueue: Array<PlayerObject>): void {
		for (const player of playersInQueue) {
			const playerId = player.id;
			const numberTeam = teamInMemory.verifyPreferenceTeam();
			this.movePlayerForTeam(playerId, numberTeam);
		}
	}

	public removePlayerTeam(idPlayer: number, numberTeam: TEAM) {
		teamInMemory.removePlayerTeam(idPlayer, numberTeam)
	}

	//   public getMissingPlayersFromMatch(): number {
	//     return (
	//       CONSTANTS.MAX_PLAYERS_IN_MATCH -
	//       (this.teamRed.length + this.teamBlue.length)
	//     );
	//   }

	public verifyCaptainWithPreferenceChoice(): number {
		const lengthTeamRed = this.teamRepository.getLengthTeam(1);
		const lengthTeamBlue = this.teamRepository.getLengthTeam(2);
		return lengthTeamRed <= lengthTeamBlue
			? CONSTANTS.TEAMS.RED_NUMBER
			: CONSTANTS.TEAMS.BLUE_NUMBER;
	}

	public totalPlayersInMatch(): number {
		return this.teamRepository.getTotalPlayers();
	}

	//   public verifyPlayerTeamAndRemove(
	//     numberTeamPlayer: number,
	//     idPlayer: number,
	//   ): void {
	//     let index: number;
	//     switch (numberTeamPlayer) {
	//       case 1:
	//         index = this.teamRed.indexOf(idPlayer);
	//         this.teamRed.splice(index, 1);
	//         break;

	//       case 2:
	//         index = this.teamBlue.indexOf(idPlayer);
	//         this.teamBlue.splice(index, 1);
	//         break;

	//       case 0:
	//         break;
	//     }
	//   }

	//   public moveWinPlayers(numberTeam: number) {
	//     if (numberTeam === CONSTANTS.TEAMS.RED_NUMBER) {
	//       return;
	//     }

	//     this.teamRed = [];
	//     this.teamBlue.forEach((id) => {
	//       this.room.setPlayerTeam(id, CONSTANTS.TEAMS.RED_NUMBER);
	//       this.teamRed.push(id);
	//     });
	//     this.teamBlue = [];
	//   }

	//   public moveLoserPlayers(numberTeam: number) {
	//     let playersId: Array<number>;
	//     if (numberTeam === CONSTANTS.TEAMS.RED_NUMBER) {
	//       playersId = this.teamRed;
	//       this.teamRed = [];
	//     } else {
	//       playersId = this.teamBlue;
	//       this.teamBlue = [];
	//     }

	//     playersId.forEach((id) => {
	//       this.room.setPlayerTeam(id, CONSTANTS.TEAMS.SPEC);
	//     });
	//   }
}
