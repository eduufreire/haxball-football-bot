import { CONFIG } from "../../config";
import { getMissingPlayers, getSpectatorsPlayers, showPlayersInTheQueue } from "./utils-functions";

export let teamRed: Array<number> = [];
export let teamBlue: Array<number> = [];

export const checkTeamsIsCorrect = (room: RoomObject) => {
  let spectatorPlayers = getSpectatorsPlayers(room);
  let missingPlayers = getMissingPlayers()

  if (missingPlayers === CONFIG.TOTAL_PLAYERS) {
    room.startGame();
  }

  let checkIfGoesIntoChoiceMode = missingPlayers > 0 && spectatorPlayers.length > missingPlayers
  if (checkIfGoesIntoChoiceMode) {
    room.pauseGame(true);
    CONFIG.GAME_PAUSED = true;
    CONFIG.NEED_PLAYER_IN_TEAM = true;
    let captainId = teamRed.length < teamBlue.length ? teamRed[0] : teamBlue[0];
    showPlayersInTheQueue(captainId, room);
    return;
  }

  let distributeSpectatorsInTwoTeams =
    spectatorPlayers.length < missingPlayers
      ? spectatorPlayers.length
      : missingPlayers;

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
  
};
