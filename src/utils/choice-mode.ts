import { CONFIG } from "../../config";
import { teamRed, teamBlue, checkTeamsIsCorrect } from "./check-teams";
import { getSpectatorsPlayers, showPlayersInTheQueue } from "./utils-functions";

export function playerChoiceMode(
  room: RoomObject,
  player: PlayerObject,
  msg: string
): boolean {

  let spectatorPlayers = getSpectatorsPlayers(room);

  let index = parseInt(msg);
  if (index < 0 || index > spectatorPlayers.length) {
    room.sendAnnouncement("Número inválido, digite novamente", player.id);
    showPlayersInTheQueue(player.id, room)
    return false;
  }

  let chosenPlayer = spectatorPlayers[index - 1];
  if (teamRed.length < teamBlue.length) {
    room.setPlayerTeam(chosenPlayer.id, 1);
    teamRed.push(chosenPlayer.id);
  } else {
    room.setPlayerTeam(chosenPlayer.id, 2);
    teamBlue.push(chosenPlayer.id);
  }

  let totalPlayersInTheTwoTeams = teamRed.length + teamBlue.length;
  let missingPlayersTeams = CONFIG.TOTAL_PLAYERS - totalPlayersInTheTwoTeams;
  if (missingPlayersTeams === 0) {
    room.pauseGame(false);
    CONFIG.GAME_PAUSED = false;
    CONFIG.NEED_PLAYER_IN_TEAM = false;
  }
  return false;

}
