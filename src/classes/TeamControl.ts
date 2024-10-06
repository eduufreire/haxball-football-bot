import { GLOBALS } from "../config";
import { CONSTANTS } from "../utils/constants";
import { Room } from "./Room";

export class TeamControl {
  constructor(
    private room: RoomObject = Room.getRoom(),
    private teamRed: Array<number> = [],
    private teamBlue: Array<number> = []
  ) {}

  addPlayerTeam(id: number, team: number) {
    switch(team) {
      case 1:
        this.teamRed.push(id)
        break;
      case 2:
        this.teamBlue.push(id)
        break;
    }
  }

  getActivePlayersInQueue(): Array<PlayerObject> {
    // TODO: futuramente, aplicar filtro também para pessoas ausentes
    return this.room.getPlayerList().filter((p) => p.id != 0 && p.team === 0);
  }

  getMissingPlayersFromMatch(): number {
    return 4 - (this.teamRed.length + this.teamBlue.length);
  }

  getPlayersInMatch(): number {
    return this.teamRed.length + this.teamBlue.length;
  }

  upadteIdCaptains() {
    GLOBALS.CAPTAINS.RED = this.teamRed[0]
    GLOBALS.CAPTAINS.BLUE = this.teamBlue[0]
  }

  
  autoAddPlayers() {
    let playersInQueue = this.getActivePlayersInQueue();

    if (
      this.getPlayersInMatch() < 4 &&
      playersInQueue.length <= this.getMissingPlayersFromMatch() 
    ) {
      for (var i = 0; i < playersInQueue.length; i++) {
        console.log(i)
        let playerId = playersInQueue[i].id;
        if (this.teamRed.length <= this.teamBlue.length) {
          this.teamRed.push(playerId);
          this.room.setPlayerTeam(playerId, 1);
        } else if (this.teamBlue.length < this.teamRed.length) {
          this.teamBlue.push(playerId);
          this.room.setPlayerTeam(playerId, 2);
        } 
      }
    }

  }

  verifyPlayerTeamAndRemove(
    numberTeamPlayer: number,
    idPlayer: number
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

  showPlayersActivesForChoice() {
    let players = this.getActivePlayersInQueue();

    let message = "pv";
    players.forEach((player, index) => {
      if (index === players.length - 1) {
        message += `${player.name}[${index + 1}]`;
        return;
      }
      message += `${player.name}[${index + 1}], `;
    });

    let idTeamCaptain =
      this.teamRed.length < this.teamBlue.length
        ? this.teamRed[0]
        : this.teamBlue[0];

    this.room.sendAnnouncement(message, idTeamCaptain, 0xe8a157, "bold", 1);
  }

}
