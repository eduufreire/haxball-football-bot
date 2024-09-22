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


    removePlayers() {
        let playersInMatch = this.getPlayersInMatch();
        for (var i = 0; i < playersInMatch; i++) {
            let index: number | undefined;
            if (this.teamRed.length > this.teamBlue.length) {
                index = this.teamRed.pop();
            } else if (this.teamBlue.length > this.teamRed.length) {
                index = this.teamBlue.pop();
            }

            if(index){
                this.room.setPlayerTeam(index, 0);
            }
        }
    }


    addPlayers() {
        let playersInQueue = this.getActivePlayersInQueue();
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
