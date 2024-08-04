/**
 * @description return spectators in queue, ignoring `Player Bot`
 * @param room: RoomObject
 * @returns Array
 */
export function getSpectatorsPlayers(room: RoomObject): Array<PlayerObject> {
  let spectatorPlayers: Array<PlayerObject> = room
    .getPlayerList()
    .filter((p) => p.team === 0);
  spectatorPlayers.splice(0, 1);
  return spectatorPlayers;
}

export function verifyMessageIsNumber(msg: string) {
  const regex = /^[0-9]{1,}$/;
  return regex.test(msg);
}

export function showPlayersInTheQueue(idPlayer: number, room: RoomObject) {
  let spectatorPlayers = getSpectatorsPlayers(room);

  let message = "[PV] ";
  spectatorPlayers.forEach((p, index) => {
    if (index === spectatorPlayers.length - 1) {
      message += `${p.name} [${index + 1}]`;
      return;
    }
    message += `${p.name} [${index + 1}], `;
  });

  room.sendAnnouncement(
    "Digite um número para escolher um jogador: ",
    idPlayer,
    0xcf9252,
    "bold",
    1
  );
  room.sendAnnouncement(message, idPlayer, 0xe8a157, "bold", 1);
}
