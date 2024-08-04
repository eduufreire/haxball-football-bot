import { CONFIG } from "../../config";
import { getSpectatorsPlayers, showPlayersInTheQueue } from "./utils-functions";

export let teamRed: Array<number> = [];
export let teamBlue: Array<number> = [];

export const checkTeamsIsCorrect = (room: RoomObject) => {
  let spectatorPlayers = getSpectatorsPlayers(room);

  let totalPlayersInTheTwoTeams = teamRed.length + teamBlue.length;
  let missingPlayersTeams = CONFIG.TOTAL_PLAYERS - totalPlayersInTheTwoTeams;

  if (totalPlayersInTheTwoTeams === 0) {
    room.startGame();
  }

  let checkIfGoesIntoChoiceMode = missingPlayersTeams > 0 && spectatorPlayers.length > missingPlayersTeams
  if (checkIfGoesIntoChoiceMode) {
    room.pauseGame(true);
    CONFIG.GAME_PAUSED = true;
    CONFIG.NEED_PLAYER_IN_TEAM = true;
    let captainId = teamRed.length < teamBlue.length ? teamRed[0] : teamBlue[0];
    showPlayersInTheQueue(captainId, room);
    return;
  }

  if (totalPlayersInTheTwoTeams < CONFIG.TOTAL_PLAYERS) {
    let distributeSpectatorsInTwoTeams =
      spectatorPlayers.length < missingPlayersTeams
        ? spectatorPlayers.length
        : missingPlayersTeams;

    for (var i = 0; i < distributeSpectatorsInTwoTeams; i++) {
      let playerId = spectatorPlayers[i].id;

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
    return;
  }
};
