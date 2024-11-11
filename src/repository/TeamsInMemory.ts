type TeamsObject = {
	idCaptain: number;
	players: Array<number>;
	streak?: number;
	uniform?: object;
};

export enum TEAM {
	RED = 1,
	BLUE = 2,
	SPEC = 0
}

export interface TeamRepository {
	addPlayerTeam(idPlayer: number, numberTeam: TEAM): void;
	removePlayerTeam(idPlayer: number, numberTeam: TEAM): void;
	removeLastPlayer(numberTeam: TEAM): number;
	removeAllPlayers(numberTeam: TEAM): Array<number>;
	getCaptainTeam(numberTeam: TEAM): number;
	getLengthTeam(numberTeam: TEAM): number;
	getTotalPlayers(): number;
	verifyPreferenceTeam(): TEAM
}

class TeamsInMemory implements TeamRepository {
	private teamRed: TeamsObject;
	private teamBlue: TeamsObject;

	constructor() {
		this.teamRed = {
			idCaptain: 99,
			players: [],
		};

		this.teamBlue = {
			idCaptain: 99,
			players: [],
		};
	}

	public addPlayerTeam(idPlayer: number, numberTeam: TEAM): void {
		if (numberTeam === 1) {
			this.teamRed.players.push(idPlayer);
		} else {
			this.teamBlue.players.push(idPlayer);
		}
	}

	public removePlayerTeam(idPlayer: number, numberTeam: TEAM): void {
		let index = 0;
		if (numberTeam === TEAM.RED) {
			index = this.teamRed.players.indexOf(idPlayer);
			this.teamRed.players.splice(index, 1);
		} else {
			index = this.teamBlue.players.indexOf(idPlayer);
			this.teamBlue.players.splice(index, 1);
		}
	}

	public removeLastPlayer(numberTeam: TEAM): number {
		const LAST_INDEX = 1;
		if (numberTeam === TEAM.RED) {
			return this.teamRed.players.splice(LAST_INDEX, 1)[0];
		} 
		return this.teamBlue.players.splice(LAST_INDEX, 1)[0];
	}

	public verifyPreferenceTeam(): TEAM {
		return this.getLengthTeam(TEAM.RED) <= this.getLengthTeam(TEAM.BLUE)
			? TEAM.RED
			: TEAM.BLUE;
	}

	public removeAllPlayers(numberTeam: TEAM): Array<number> {
		if(numberTeam === TEAM.RED) {
			return this.teamRed.players.splice(0, 4)
		}
		return this.teamBlue.players.splice(0, 4)
	}

	public getCaptainTeam(numberTeam: TEAM): number {
		if (numberTeam === TEAM.RED) {
			return this.teamRed.players[0];
		}
		return this.teamBlue.players[0];
	}

	public getLengthTeam(numberTeam: number): number {
		if (numberTeam === TEAM.RED) {
			return this.teamRed.players.length;
		}
		return this.teamBlue.players.length;
	}

	public getTotalPlayers(): number {
		return this.getLengthTeam(TEAM.RED) + this.getLengthTeam(TEAM.BLUE);
	}
}

export const teamInMemory = new TeamsInMemory();
