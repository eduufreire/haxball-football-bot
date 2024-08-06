import { CONFIG } from "../../config";
import { teamRed, teamBlue } from "./check-teams";
import { getMissingPlayers, getSpectatorsPlayers, showPlayersInTheQueue } from "./utils-functions";

export function playerChoiceMode(
  room: RoomObject,
  player: PlayerObject,
  msg: string
): boolean {

  let spectatorPlayers = getSpectatorsPlayers(room);

  let indexPlayer = parseInt(msg);
  if (indexPlayer < 0 || indexPlayer > spectatorPlayers.length) {
    room.sendAnnouncement("Número inválido, digite novamente", player.id);
    showPlayersInTheQueue(player.id, room)
    return false;
  }

  let chosenPlayer = spectatorPlayers[indexPlayer - 1];
  if (teamRed.length < teamBlue.length) {
    room.setPlayerTeam(chosenPlayer.id, 1);
    teamRed.push(chosenPlayer.id);
  } else {
    room.setPlayerTeam(chosenPlayer.id, 2);
    teamBlue.push(chosenPlayer.id);
  }

  let missingPlayers = getMissingPlayers()
  if (missingPlayers === 0) {
    room.pauseGame(false);
    CONFIG.GAME_PAUSED = false;
    CONFIG.NEED_PLAYER_IN_TEAM = false;
  }
  return false;

}
