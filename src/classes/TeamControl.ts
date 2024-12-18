import { CONSTANTS } from "../utils/constants";
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
			const id = player.id;
			const numberTeam = this.teamRepository.verifyPreferenceTeam();
			this.movePlayerForTeam(id, numberTeam);
		}
	}

	public  autoRemovePlayers(): void {
		const lengthTeamRed = this.teamRepository.getLengthTeam(1);
		const lengthTeamBlue = this.teamRepository.getLengthTeam(2);
		let playerId = 0;
		if (lengthTeamRed < lengthTeamBlue) {
			playerId = this.teamRepository.removeLastPlayer(TEAM.BLUE);
			this.room.setPlayerTeam(playerId, 0);
		} else if (lengthTeamBlue < lengthTeamRed) {
			playerId = this.teamRepository.removeLastPlayer(TEAM.RED);
			this.room.setPlayerTeam(playerId, 0);
		}
		return;
	}

	public changeAllPlayers(from: TEAM, to: TEAM) {
		const players = teamInMemory.removeAllPlayers(from);
		for (const playerId of players) {
			this.room.setPlayerTeam(playerId, to);
			if (to === TEAM.RED) {
				teamInMemory.addPlayerTeam(playerId, TEAM.RED);
			}
		}
	}

	public removePlayerTeam(idPlayer: number, numberTeam: TEAM) {
		this.teamRepository.removePlayerTeam(idPlayer, numberTeam);
	}

	public verifyCaptainWithPreferenceChoice(): number {
		const lengthTeamRed = this.teamRepository.getLengthTeam(1);
		const lengthTeamBlue = this.teamRepository.getLengthTeam(2);
		return lengthTeamRed <= lengthTeamBlue
			? CONSTANTS.TEAMS.RED_NUMBER
			: CONSTANTS.TEAMS.BLUE_NUMBER;
	}

	// ALTERAR AQUI
	public neededPlayersInMatch(): boolean {
		return (
			this.teamRepository.getTotalPlayers() <
			CONSTANTS.MAX_PLAYERS_IN_MATCH 
		);
	}
}
