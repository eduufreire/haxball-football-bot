import { balanceTeams } from "../utils/balance-teams"

export const playerJoinHandler = (room: RoomObject, player: PlayerObject) => {
    balanceTeams(room)
}
