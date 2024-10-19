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

  public autoAddPlayers(playersInQueue: Array<PlayerObject>): void {
    playersInQueue.forEach((player) => {
      let playerId = player.id;
      if (this.teamRed.length <= this.teamBlue.length) {
        this.movePlayerForTeam(playerId, CONSTANTS.TEAMS.RED_NUMBER);
      } else if (this.teamBlue.length < this.teamRed.length) {
        this.movePlayerForTeam(playerId, CONSTANTS.TEAMS.BLUE_NUMBER);
      }
    });
  }

  public getMissingPlayersFromMatch(): number {
    return (
      CONSTANTS.MAX_PLAYERS_IN_MATCH -
      (this.teamRed.length + this.teamBlue.length)
    );
  }

  public getNumberPlayersInMatch(): number {
    return this.teamRed.length + this.teamBlue.length;
  }

  public getCaptains(): TeamCaptains {
    let defaultValue = 99;
    return {
      redID: this.teamRed[0] ?? defaultValue,
      blueID: this.teamBlue[0] ?? defaultValue,
    };
  }

  public verifyCaptainWithPreferenceChoice(): number {
    return this.teamRed.length <= this.teamBlue.length
      ? CONSTANTS.TEAMS.RED_NUMBER
      : CONSTANTS.TEAMS.BLUE_NUMBER;
  }

  public verifyPlayerTeamAndRemove(
    numberTeamPlayer: number,
    idPlayer: number
  ): void {
    let index: number;
    switch (numberTeamPlayer) {
      case 1:
        index = this.teamRed.indexOf(idPlayer);
        this.teamRed.splice(index, 1);
        break;

      case 2:
        index = this.teamBlue.indexOf(idPlayer);
        this.teamBlue.splice(index, 1);
        break;

      case 0:
        break;
    }
  }


  public moveWinPlayers(numberTeam: number) {
    if (numberTeam === CONSTANTS.TEAMS.RED_NUMBER) {
      return;
    } 

    this.teamRed = []
    this.teamBlue.forEach( id => {
      this.room.setPlayerTeam(id, CONSTANTS.TEAMS.RED_NUMBER)
      this.teamRed.push(id)
    })
    this.teamBlue = []
  }


  public moveLoserPlayers(numberTeam: number) {
    let playersId: Array<number>;
    if( numberTeam === CONSTANTS.TEAMS.RED_NUMBER) {
      playersId = this.teamRed
      this.teamRed = []
    } else {
      playersId = this.teamBlue;
      this.teamBlue = []
    }

    playersId.forEach(id => {
      this.room.setPlayerTeam(id, CONSTANTS.TEAMS.SPEC)
    })
  }
}
