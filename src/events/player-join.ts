import { checkTeamsIsCorrect } from "../utils/check-teams"

export const playerJoinHandler = (room: RoomObject, player: PlayerObject) => {
    checkTeamsIsCorrect(room)
}
