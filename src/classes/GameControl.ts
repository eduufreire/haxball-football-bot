import { GLOBALS } from "../config";
import { mainStadium } from "../stadiums/mainStadium";
import { noGoalStadium } from "../stadiums/noGoalStadium";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameControl {
    
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
        private timer: NodeJS.Timeout | null = null
    ) { }

    gameHandler() {
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (missingPlayers > 0 && playersInQueue <= missingPlayers) {
            this.teamControl.autoAddPlayers();
            this.startTimerLoop()
            this.changeStadium()
        }

        if(missingPlayers === 0) {
            this.stopTimerLoop()
            this.changeStadium()
        }

    }

    enablePlayerChoiceMode() {
        this.room.pauseGame(true)
        GLOBALS.NEED_PLAYER_IN_TEAM = true;
        this.teamControl.showPlayersActivesForChoice()
    }

    controlAfterPlayerLeft(player: PlayerObject) {
        let wasRemoved = this.teamControl.verifyPlayerTeamAndRemove(player.team, player.id);
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (wasRemoved && playersInQueue > missingPlayers) {
            this.enablePlayerChoiceMode()
            return;
        } else {
            this.teamControl.autoRemovePlayers();
        }

        console.log('passou')
        this.gameHandler()
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


    private startTimerLoop() {
        if(this.timer === null) {
            let contador = 0
            this.timer = setInterval(() => {
                console.log(`timer rodando ${contador++}`)
                this.gameHandler()
            }, 1500)
        }
    }

    private stopTimerLoop() {
        if(this.timer != null) {
            console.log('parando')
            clearInterval(this.timer);
            this.timer = null;
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