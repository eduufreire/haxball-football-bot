import { GameHandler } from "../classes/GamerHandler";
import { Room } from "../classes/Room";
import { Timer } from "../classes/Timer";
import { TeamCaptains } from "../interface/Handler";

export default function playerChat() {
  const room = Room.getRoom();
  const gameControl = new GameHandler();
  const timer = new Timer(gameControl);
  const captains: TeamCaptains | null = null;

  room.onRoomLink = (link) => {
    console.log(link);
    room.startGame();
    timer.startTimer(1500);
  };

  room.onPlayerJoin = (player) => {
    if (gameControl.isChoiceMode) {
      gameControl.showSpectatorsPlayerForChoice();
    }
  };

  room.onPlayerLeave = (player) => {
    if (gameControl.isChoiceMode) {
      gameControl.showSpectatorsPlayerForChoice();
    }
    gameControl.controlAfterPlayerLeft(player);
  };

  room.onGamePause = (byPlayer) => {
    if (gameControl.isChoiceMode) {
      gameControl.showSpectatorsPlayerForChoice();
    }
  };

  //   room.onPlayerTeamChange = (changed, player) => {
  //     if(gameControl.isChoiceMode) {
  // 		gameControl.showSpectatorsPlayerForChoice()
  // 	}
  //   }
  
  room.onPlayerChat = (player, msg) => {
    let isCaptain = player.id === captains?.redID || player.id === captains?.blueID
    if(gameControl.verifyIsChoiceMode() && isCaptain) {
      if(gameControl.verifyPreferenceChoice() !== player.team) {
        return true
      }

      if(verifyMessageIsNumber(msg)) {
        gameControl.choicePlayerForTeam(parseInt(msg), player.id, player.team)
        return false;
      }
    }

    if(msg.startsWith("#")){
      room.setPlayerAdmin(player.id, true)

      return false
    }

    return true
  }

  // room.onTeamVictory = (scores) => {
  //   gameControl.handlerVictoryTeam(scores.red, scores.blue)
  // }

  // room.onGameTick = () => {
  //   if (gameControl.quantidadeDePessoas() === 0) {
  //     timer.stopTimer();
  //   }
  //   captains = gameControl.getCaptains();
  // };
}

function verifyMessageIsNumber(msg: string) {
  const regex = /^[0-9]{1,}$/;
  return regex.test(msg);
}
