import { GLOBALS } from "../config";
import playerChat from "../events/eventHandle";
import { Handler } from "../interface/Handler";
import { mainStadium } from "../stadiums/mainStadium";
import { noGoalStadium } from "../stadiums/noGoalStadium";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameHandler implements Handler {
    
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
    ) { }

    handlerGame() {
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (missingPlayers > 0 && playersInQueue <= missingPlayers) {
            this.teamControl.autoAddPlayers();
        }
        
        if(playersInQueue > missingPlayers && missingPlayers > 0) {
            this.enablePlayerChoiceMode()
        }

        this.teamControl.upadteIdCaptains()
    }

    enablePlayerChoiceMode() {
        if(!GLOBALS.CHOOSE_MODE) {
            this.room.pauseGame(true)
            GLOBALS.CHOOSE_MODE = true;
        }
        this.teamControl.showPlayersActivesForChoice()
    }

    disablePlayerChoiceMode() {
        this.room.pauseGame(false)
        GLOBALS.CHOOSE_MODE = false;
    }

    modoEscolha(msg: string, team: number) {

        let players = this.teamControl.getActivePlayersInQueue();

        let index = parseInt(msg)
        if(index < 0 || index > players.length) {
          console.log('invalido')
            return false;
        }

        let idPlayer = players[index - 1].id
        this.room.setPlayerTeam(idPlayer, team)
        this.teamControl.addPlayerTeam(idPlayer, team)

        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();
        console.log(missingPlayers)

        if (missingPlayers > 0) {
            this.teamControl.upadteIdCaptains()
           this.enablePlayerChoiceMode()
        } else {
            this.disablePlayerChoiceMode()
            this.teamControl.upadteIdCaptains()
        }
    }


    controlAfterPlayerLeft(player: PlayerObject) {
        let wasRemoved = this.teamControl.verifyPlayerTeamAndRemove(player.team, player.id);
        if (wasRemoved) {
            this.handlerGame()
        }
    }

    changeStadium() {
        let playersAtMatch = this.teamControl.getPlayersInMatch()
        if (playersAtMatch === 4 && !GLOBALS.IS_STADIUM_MAIN) {
            this.restartGame()
            this.room.setCustomStadium(JSON.stringify(mainStadium))
            GLOBALS.IS_STADIUM_MAIN = true
        } else if (playersAtMatch < 4 && GLOBALS.IS_STADIUM_MAIN){
            this.restartGame()
            this.room.setCustomStadium(JSON.stringify(noGoalStadium))
            GLOBALS.IS_STADIUM_MAIN = false
        } 
    }
    
    private restartGame() {
        this.room.stopGame()
        setTimeout(()=>{
            this.changeStadium()
            this.room.startGame()
        }, 1000)
    }

}