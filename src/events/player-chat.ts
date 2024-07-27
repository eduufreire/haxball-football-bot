export const outroTeste = (room: RoomObject, player: PlayerObject, msg: string) => {
    let mensagem = `${player.name}: ${msg}`
    room.sendAnnouncement(mensagem, undefined, 0x9861C7, 'bold', 1)
    return false
}