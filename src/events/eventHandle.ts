import { GameControl } from "../classes/GameControl";
import { Room } from "../classes/Room";
import { GLOBALS } from "../config";

export default function playerChat() {
  let room = Room.getRoom();
  let teste =new GameControl();

  room.onPlayerJoin = (player) => {
    console.log(player.name)
    teste.controlPlayersAtMatch()
  }

  room.onPlayerLeave = (player) => {
    teste.playerLeft(player);
  }

  room.onGamePause = (byPlayer) => {
    GLOBALS.GAME_PAUSED = true
    console.log('pausou 1')
  }

  room.onGameUnpause = (byPlayer) => {
    GLOBALS.GAME_PAUSED = false
  }

  room.onGameStart = (byPlayer) => {
    GLOBALS.GAME_PAUSED = false
  }

  room.onGameStop = (byPlayer) => {
    GLOBALS.GAME_PAUSED = true
    if(!GLOBALS.IS_STADIUM_MAIN) {
      teste.changeStadium()
    }
    teste.controlPlayersAtMatch()
  }

  room.onPlayerChat = (player, msg) => {
    if(msg === '!eduardo'){
      room.setPlayerAdmin(player.id, true)
      return false
    }
    return true
  }

}
