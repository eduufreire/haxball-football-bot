import { GLOBALS } from "./config";
import HaxballJS from "haxball.js";
import playerChat from "./events/eventHandle";
import { Room } from "./classes/Room";

HaxballJS.then(
    (HBInit) => {
        let room = HBInit({
            roomName: "bot ruim demais",
            playerName: "criador do haxball 2.0",
            maxPlayers: 16,
            public: false,
            noPlayer: false,
            token: GLOBALS.TOKEN,
        });

        Room.setRoom(room);
        playerChat()
    }
);
