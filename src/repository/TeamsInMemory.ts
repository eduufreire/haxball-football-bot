type TeamsObject = {
  idCaptain: number;
  players: Array<number>;
  streak?: number;
  uniform?: object;
};

enum TEAM {
  RED = 1,
  BLUE = 2,
}

export interface TeamRepository {
  addPlayerTeam(idPlayer: number, numberTeam: TEAM): void;
  removePlayerTeam(idPlayer: number, numberTeam: TEAM): void;
  getCaptainTeam(numberTeam: TEAM): number;
  getLengthTeam(numberTeam: TEAM): number;
  getTotalPlayers(): number;
}

class TeamsInMemory implements TeamRepository {
  private teamRed: TeamsObject;
  private teamBlue: TeamsObject;

  public addPlayerTeam(idPlayer: number, numberTeam: TEAM): void {
    if (numberTeam === TEAM.RED) {
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

  public getCaptainTeam(numberTeam: TEAM): number {
    if (numberTeam === TEAM.RED) {
      return this.teamRed.players[0];
    }
    return this.teamBlue.players[0];
  }

  public getLengthTeam(numberTeam: TEAM): number {
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