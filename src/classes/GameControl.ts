import { GLOBALS } from "../config";
import { mainStadium } from "../stadiums/mainStadium";
import { noGoalStadium } from "../stadiums/noGoalStadium";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameControl {

    private timer: NodeJS.Timeout | null = null
    
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
    ) { }

    controlPlayersAtMatch() {
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (missingPlayers > 0 && playersInQueue <= missingPlayers) {
            this.teamControl.autoAddPlayers();
            this.changeStadium()
            this.startTimer()
        }

        if(missingPlayers === 0) {
            this.stopTimer()
            this.changeStadium()
        }
    }

    playerLeft(player: PlayerObject) {
        let wasRemoved = this.teamControl.verifyPlayerTeamAndRemove(player.team, player.id);
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (wasRemoved && playersInQueue > missingPlayers) {
            this.room.pauseGame(true)
        } else {
            this.teamControl.autoRemovePlayers();
        }

        this.controlPlayersAtMatch()
    }


    startTimer() {
        if(this.timer === null) {
            let contador = 0
            this.timer = setInterval(() => {
                console.log(`timer rodando ${contador++}`)
                this.controlPlayersAtMatch()
            }, 1500)
        }
    }

    stopTimer() {
        if(this.timer != null) {
            console.log('parando')
            clearInterval(this.timer);
            this.timer = null;
        }
    }


    changeStadium() {
        let playersNoCampo = this.teamControl.getPlayersInMatch()
        if (playersNoCampo === 4 && !GLOBALS.IS_STADIUM_MAIN) {
            this.restartGame()
            this.room.setCustomStadium(JSON.stringify(mainStadium))
            GLOBALS.IS_STADIUM_MAIN = true
        } else if (playersNoCampo < 4 && GLOBALS.IS_STADIUM_MAIN){
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