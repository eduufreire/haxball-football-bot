import { GLOBALS } from "../config";
import { Handler, TeamCaptains } from "../interface/Handler";
import { mainStadium } from "../stadiums/mainStadium";
import { noGoalStadium } from "../stadiums/noGoalStadium";
import { Room } from "./Room";
import { TeamControl } from "./TeamControl";

export class GameHandler implements Handler {
    
    constructor(
        private room: RoomObject = Room.getRoom(),
        private teamControl = new TeamControl(),
        private isChoiceMode: boolean = false,
        private teamCaptains: TeamCaptains | null = null
    ) { }

    handler() {
        let playersInQueue = this.teamControl.getActivePlayersInQueue().length;
        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();

        this.updateTeamCaptains()

        if (missingPlayers > 0 && playersInQueue <= missingPlayers) {
            this.teamControl.autoAddPlayers();
            return;
        }
        
        if(playersInQueue > missingPlayers && missingPlayers > 0 && !this.isChoiceMode) {
            this.enablePlayerChoiceMode()
        }
    }

    choicePlayerForTeam(playerChoiced: number, team: number) {
        let activePlayers = this.teamControl.getActivePlayersInQueue(); 

        if(playerChoiced < 0 || playerChoiced > activePlayers.length) {
            console.log('invalido')
            this.teamControl.showPlayersActivesForChoice()
            return;
        }

        let idPlayer = activePlayers[playerChoiced - 1].id
        this.room.setPlayerTeam(idPlayer, team)
        this.teamControl.movePlayerForTeam(idPlayer, team)

        let missingPlayers = this.teamControl.getMissingPlayersFromMatch();
        if (missingPlayers === 0) {
            this.disablePlayerChoiceMode()
            this.updateTeamCaptains()
        }
    }

    enablePlayerChoiceMode() {
        if(!this.isChoiceMode) {
            this.room.pauseGame(true)
            this.isChoiceMode = true;
        }
        this.teamControl.showPlayersActivesForChoice()
    }

    disablePlayerChoiceMode() {
        this.room.pauseGame(false)
        this.isChoiceMode = false;
    }

    verifyIsChoiceMode(): boolean {
        return this.isChoiceMode;
    }

    controlAfterPlayerLeft(player: PlayerObject) {
        let wasRemoved = this.teamControl.verifyPlayerTeamAndRemove(player.team, player.id);
        if (wasRemoved) {
            console.log('removido do time tal')
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

    getCaptains(): TeamCaptains | null {
        return this.teamCaptains;
    }
    
    private restartGame() {
        this.room.stopGame()
        setTimeout(()=>{
            this.changeStadium()
            this.room.startGame()
        }, 1000)
    }

    private updateTeamCaptains(): void{
        this.teamCaptains = this.teamControl.getCaptains()
    }

    

}