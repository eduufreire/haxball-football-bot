export let teamRed: Array<number> = [];
export let teamBlue: Array<number> = [];

const TOTAL_PLAYERS = 4;

export const balanceTeams = (room: RoomObject) => {
  let spectatorPlayers: Array<PlayerObject> = room
    .getPlayerList()
    .filter((p) => p.team === 0);
  spectatorPlayers.splice(0, 1);

  let totalPlayersInTheTwoTeams = teamRed.length + teamBlue.length;
  let missingPlayersTeams = TOTAL_PLAYERS - totalPlayersInTheTwoTeams;

  if (totalPlayersInTheTwoTeams === 0) {
    room.startGame();
  }

  if (missingPlayersTeams > 0 && spectatorPlayers.length > missingPlayersTeams) {
    console.log("choose mode");
    return;
  }

  if (totalPlayersInTheTwoTeams < TOTAL_PLAYERS) {
    let distributeSpectators =
      spectatorPlayers.length < missingPlayersTeams
        ? spectatorPlayers.length
        : missingPlayersTeams;

    for (var i = 0; i < distributeSpectators; i++) {
      let playerId = spectatorPlayers[i].id;

      if (teamRed.length === teamBlue.length) {
        room.setPlayerTeam(playerId, 1);
        teamRed.push(playerId);
      } else {
        room.setPlayerTeam(playerId, 2);
        teamBlue.push(playerId);
      }
    }
  }
};
