import { TeamCaptains } from "../interface/Handler";
import { CONSTANTS } from "../utils/constants";
import { Room } from "./Room";

export class TeamControl {
  constructor(
    private room: RoomObject = Room.getRoom(),
    private teamRed: Array<number> = [],
    private teamBlue: Array<number> = []
  ) {}

  public movePlayerForTeam(idPlayer: number, numberTeam: number): void {
    this.room.setPlayerTeam(idPlayer, numberTeam);
    switch (numberTeam) {
      case 1:
        this.teamRed.push(idPlayer);
        break;
      case 2:
        this.teamBlue.push(idPlayer);
        break;
    }
  }


  public autoAddPlayers(playersInQueue: Array<PlayerObject>) {
    if (
      this.getPlayersInMatch() < 4 &&
      playersInQueue.length <= this.getMissingPlayersFromMatch()
    ) {
      playersInQueue.forEach( player => {
        let playerId = player.id
        if (this.teamRed.length <= this.teamBlue.length) {
          this.teamRed.push(playerId);
          this.room.setPlayerTeam(playerId, 1);
        } else if (this.teamBlue.length < this.teamRed.length) {
          this.teamBlue.push(playerId);
          this.room.setPlayerTeam(playerId, 2);
        }
      })
    }
  }

  public getMissingPlayersFromMatch(): number {
    return 4 - (this.teamRed.length + this.teamBlue.length);
  }

  public getPlayersInMatch(): number {
    return this.teamRed.length + this.teamBlue.length;
  }

  public getCaptains(): TeamCaptains {
    return {
      redID: this.teamRed[0] ?? 99,
      blueID: this.teamBlue[0] ?? 99,
    };
  }


  public verifyCaptainWithPreferenceChoice(): number {
    return this.teamRed.length <= this.teamBlue.length
      ? CONSTANTS.TEAMS.RED_NUMBER
      : CONSTANTS.TEAMS.BLUE_NUMBER;
  }

  
  public verifyPlayerTeamAndRemove(
    numberTeamPlayer: number, idPlayer: number
  ): boolean {
    let index: number;
    let removed = false;
    switch (numberTeamPlayer) {
      case 1:
        index = this.teamRed.indexOf(idPlayer);
        this.teamRed.splice(index, 1);
        removed = true;
        break;

      case 2:
        index = this.teamBlue.indexOf(idPlayer);
        this.teamBlue.splice(index, 1);
        removed = true;
        break;

      case 0:
        break;
    }
    return removed;
  }
}
