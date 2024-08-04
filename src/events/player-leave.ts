import { checkTeamsIsCorrect, teamBlue, teamRed } from "../utils/check-teams"
import { getSpectatorsPlayers } from "../utils/utils-functions"

export const playerLeaveHandler = (
    room: RoomObject, player: PlayerObject
) => {

    if(player.team !== 0) {
        if (player.team === 1) {
            let index = teamRed.indexOf(player.id)
            teamRed.splice(index, 1)
        } else {
            let index = teamBlue.indexOf(player.id)
            teamBlue.splice(index, 1)
        }
    }
    checkTeamsIsCorrect(room)
    
}
