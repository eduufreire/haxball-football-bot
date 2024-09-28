import { CONSTANTS } from "../utils/constants";
import { Room } from "./Room";

export class TeamControl {
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamRed: Array<number> = [],
        private teamBlue: Array<number> = []
    ) {}

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

    autoRemovePlayers() {
        let playersInMatch = this.getPlayersInMatch();
        let missingPlayers = this.getMissingPlayersFromMatch();
        let playesInTheRoom = this.getActivePlayersInQueue().length;

        if(playersInMatch % 2 != 0 && playesInTheRoom == 0) {
            for (var i = 0; i < playersInMatch; i++) {
                let index: number | undefined;
                if (this.teamRed.length > this.teamBlue.length) {
                    index = this.teamRed.pop();
                } else if (this.teamBlue.length > this.teamRed.length) {
                    index = this.teamBlue.pop();
                }
                
                if (index) {
                    this.room.setPlayerTeam(index, 0);
                }
            }
        }
    }


    autoAddPlayers() {
        let playersInQueue = this.getActivePlayersInQueue();

        if(
            (this.getPlayersInMatch() < 2) ||
            playersInQueue.length >= this.getMissingPlayersFromMatch()
        ) {

            for (var i = 0; i < playersInQueue.length; i++) {

                let playerId = playersInQueue[i].id;
                let numberTeam = CONSTANTS.TEAMS.SPEC;
            
                if (this.teamRed.length < this.teamBlue.length) {
                    numberTeam = CONSTANTS.TEAMS.RED;
                    this.teamRed.push(playerId);
    
                } else if (this.teamRed.length === this.teamBlue.length) {
                    numberTeam = CONSTANTS.TEAMS.RED;
                    this.teamRed.push(playerId);
    
                } else {
                    numberTeam = CONSTANTS.TEAMS.BLUE
                    this.teamBlue.push(playerId);
                }
    
                this.room.setPlayerTeam(playerId, numberTeam);
            }

        }
    }

    verifyPlayerTeamAndRemove(numberTeamPlayer: number, idPlayer: number): boolean {
        let index: number;
        let removed= false;;
        switch(numberTeamPlayer) {
            case 1:
                index = this.teamRed.indexOf(idPlayer)
                this.teamRed.splice(index, 1);
                removed = true;
                break;

            case 2:
                index = this.teamBlue.indexOf(idPlayer)
                this.teamBlue.splice(index, 1);
                removed = true;
                break;

            case 0:
                break;
        }
        return removed;
    }

}
