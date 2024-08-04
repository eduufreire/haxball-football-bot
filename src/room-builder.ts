import { Headless } from "haxball.js";
import { playerJoinHandler } from "./events/player-join";
import { playerSendMessageHandle } from "./events/player-chat";
import { stadium } from "./stadiums/stadium";
import { playerLeaveHandler } from "./events/player-leave";
import { CONFIG } from "../config";

const roomBuilder = (HBInit: Headless) => {
  let room = HBInit({
    roomName: "bot merda",
    playerName: "ONÇA CACETUDA",
    maxPlayers: 16,
    public: false,
    noPlayer: false,
    token: CONFIG.TOKEN,
    geo: { lat: -23.6283, lon: -46.6409, code: "br" },
  });

  room.setCustomStadium(JSON.stringify(stadium));
  room.setScoreLimit(3);
  room.setTimeLimit(3);
  room.setTeamsLock(true);

  room.onRoomLink = (link) => {
    console.log(link);
  };

  room.onPlayerJoin = (player) => playerJoinHandler(room, player);
  room.onPlayerLeave = (player) => playerLeaveHandler(room, player);
  room.onPlayerChat = (player, message) => playerSendMessageHandle(room, player, message);

};

export default roomBuilder;
