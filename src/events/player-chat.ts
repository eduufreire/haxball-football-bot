import { playerChoiceMode } from "../utils/choice-mode";
import { CONFIG } from "../../config";
import { teamBlue, teamRed } from "../utils/check-teams";
import {verifyMessageIsNumber} from "../utils/utils-functions";

export const playerSendMessageHandle = (
  room: RoomObject,
  player: PlayerObject,
  msg: string
) => {
  if (CONFIG.GAME_PAUSED && CONFIG.NEED_PLAYER_IN_TEAM) {
    let isCaptain = player.id === teamRed[0] || player.id === teamBlue[0];
    if (isCaptain && verifyMessageIsNumber(msg)) {
      playerChoiceMode(room, player, msg);
      return false;
    }
  }

  let mensagem = `${player.name}: ${msg}`;
  room.sendAnnouncement(mensagem, undefined, 0x9861c7, "bold", 1);
  return false;
};
