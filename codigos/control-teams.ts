import { Room } from "../src/classes/Room";

let playesInTheRoom: PlayerObject[]
let teamBlue: number[] = []
let teamRed: number[] = []
let teste: NodeJS.Timeout;
let rodarInterval: boolean = true;
let room: RoomObject;

export function tirarCara(player: PlayerObject) {
    if(player.team !== 0) {
        let index;
        if (player.team === 1) {
            index = teamRed.indexOf(player.id)
            teamRed.splice(index, 1)
        } else {
            index = teamBlue.indexOf(player.id)
            teamBlue.splice(index, 1)
        }
    }
    balanceTeam()
}



export function balanceTeam() {

    let quantidadesEmCAmpo = teamBlue.length + teamRed.length
    let missingPlayers = 4 - (teamBlue.length + teamRed.length)
    // verifica se n tem player no spec
    // e verifica se um algum time tem um a mais
    if(playesInTheRoom.length <= missingPlayers && quantidadesEmCAmpo % 2 != 0) {
        for (var i = 0; i < quantidadesEmCAmpo; i++) {
            let index: any
            if (teamRed.length > teamBlue.length) {
                index = teamRed.pop();
                room.setPlayerTeam(index, 0);
                console.log('era pra ter tirado')
            } else if (teamBlue.length > teamRed.length) {
                index = teamBlue.pop();
                room.setPlayerTeam(index, 0);
            }
        }
        return
    }
    controlTeam()
    return
}


export function checkGoalOrNoGoal() {
    room.stopGame()
    let quantidadesEmCAmpo = teamBlue.length + teamRed.length
    if(quantidadesEmCAmpo < 4) {
        room.setDefaultStadium("Classic")
    } 
    room.startGame()
}



export function controlTeam() {

    room = Room.getRoom();
    playesInTheRoom = room.getPlayerList().filter((p) => p.id != 0 && p.team === 0)
    let missingPlayers = 4 - (teamBlue.length + teamRed.length)
    
    if(missingPlayers > 0 && rodarInterval) {
        rodarInterval = false
        checkGoalOrNoGoal()
        teste = setInterval(() => {
            controlTeam()
        }, 3000)
        return
    } else if (missingPlayers == 0) {
        room.pauseGame(true)
        checkGoalOrNoGoal()
        room.pauseGame(false)
        rodarInterval = true
        clearInterval(teste)
    }

    if(missingPlayers > 0 &&  playesInTheRoom.length <= missingPlayers) {
        if(playesInTheRoom.length % 2 == 0) {
            for (var i = 0; i < playesInTheRoom.length; i++) {
                let playerId = playesInTheRoom[i].id;
            
                if (teamRed.length < teamBlue.length) {
                    room.setPlayerTeam(playerId, 1);
                    teamRed.push(playerId);
                } else if (teamRed.length === teamBlue.length) {
                    room.setPlayerTeam(playerId, 1);
                    teamRed.push(playerId);
                } else {
                    room.setPlayerTeam(playerId, 2);
                    teamBlue.push(playerId);
                }
            }
        }
    }

}