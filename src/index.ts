
import { GLOBALS } from "./config";
import HaxballJS from "haxball.js";
import playerChat from "./events/eventHandle";
import { Room } from "./classes/Room";

HaxballJS.then(
    (HBInit) => {
        let room = HBInit({
            roomName: "bot merda",
            playerName: "ONÇA CACETUDA",
            maxPlayers: 16,
            public: false,
            noPlayer: false,
            token: GLOBALS.TOKEN,
            geo: { lat: -23.6283, lon: -46.6409, code: "br" },
        });

        Room.setRoom(room);
        playerChat()
    }
);
