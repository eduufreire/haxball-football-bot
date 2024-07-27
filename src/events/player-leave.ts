import { balanceTeams, teamBlue, teamRed } from "../utils/balance-teams"

export const playerLeaveHandler = (
    room: RoomObject, player: PlayerObject
) => {

    let spectatorPlayers: Array<PlayerObject> = room
        .getPlayerList()
        .filter(p => p.team === 0)
    spectatorPlayers.splice(0, 1)

    if(player.team !== 0) {
        if (player.team === 1) {
            let index = teamRed.indexOf(player.id)
            teamRed.splice(index, 1)
        } else {
            let index = teamBlue.indexOf(player.id)
            teamBlue.splice(index, 1)
        }
    }

    if (spectatorPlayers.length > 1) {
        console.log('chooseMode')
        return;
    }
    balanceTeams(room)

}
