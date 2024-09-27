import { GLOBALS } from "../config";
import { mainStadium } from "../stadiums/mainStadium";
import { noGoalStadium } from "../stadiums/noGoalStadium";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameControl {

    private gameStarted: boolean = false
    
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
        private timer: NodeJS.Timeout | null = null,
    ) { }

    controlPlayersAtMatch() {
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if (missingPlayers > 0 && playersInQueue <= missingPlayers) {
            this.teamControl.autoAddPlayers();
            this.startTimer()

            if (GLOBALS.IS_STADIUM_MAIN) {
                this.room.stopGame()
                setTimeout(()=>{
                    this.room.startGame()
                }, 500)
            }

            return
        }

        if(missingPlayers === 0 && this.timer != null) {
            this.stopTime()
            if(!GLOBALS.IS_STADIUM_MAIN) {
                this.room.stopGame()
                setTimeout(()=>{
                    this.room.startGame()
                }, 500)
                return
            }
        }

        if (playersInQueue > missingPlayers && GLOBALS.GAME_PAUSED) {
            console.log('modo escolha')
            return
        }
    }


    playerLeft(player: PlayerObject) {
        let wasRemoved = this.teamControl.verifyPlayerTeamAndRemove(player.team, player.id);
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        if(wasRemoved && playersInQueue > missingPlayers) {
            this.room.pauseGame(true)
            console.log('pausou')
        } 
        
        this.controlPlayersAtMatch()
    }

    startTimer() {
        if(this.timer === null) {
            let timerCount = 0;
            this.timer = setInterval(() => {
                console.log(`contador ${timerCount++}`)
                this.controlPlayersAtMatch()
            }, 1500)
        }
    }

    stopTime() {
        if(this.timer != null) {
            console.log('parando timer')
            clearInterval(this.timer);
            this.timer = null;
        }
    }


    changeStadium() {
        let playersNoCampo = this.teamControl.getPlayersInMatch()
        console.log(playersNoCampo)
        if (playersNoCampo === 4) {
            this.room.setCustomStadium(JSON.stringify(mainStadium))
            GLOBALS.IS_STADIUM_MAIN = true
        }else {
            this.room.setCustomStadium(JSON.stringify(noGoalStadium))
            GLOBALS.IS_STADIUM_MAIN = false
        } 
    
    }

}