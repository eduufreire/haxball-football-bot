import { GameHandler } from "../classes/GamerHandler";
import { Room } from "../classes/Room";
import { Timer } from "../classes/Timer";
import { GLOBALS } from "../config";

export default function playerChat() {

  let room = Room.getRoom();
  let gameControl = new GameHandler();
  let timer = new Timer(gameControl)

  room.onRoomLink = (link) => {
    console.log(link)
    room.startGame()
    timer.startTimer(1500)
  }

  room.onPlayerLeave = (player) => {
    gameControl.controlAfterPlayerLeft(player)
  }

  room.onPlayerChat = (player, msg) => {

    if(msg.startsWith("#")){
      room.setPlayerAdmin(player.id, true)
      return false
    }

    if(GLOBALS.CHOOSE_MODE) {
      if((player.id == GLOBALS.CAPTAINS.RED || player.id === GLOBALS.CAPTAINS.BLUE)) {
        if(verifyMessageIsNumber(msg)) {
          gameControl.modoEscolha(msg, player.team)
        }
      }
      return false
    }

    return true
  }

}

function verifyMessageIsNumber(msg: string) {
  const regex = /^[0-9]{1,}$/;
  return regex.test(msg);
}
