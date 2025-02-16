import { CONFIG } from "./config";
import HaxballJS from "haxball.js";
import { RoomConfig } from "./classes/RoomConfig";
import RoomEvents from "./classes/RoomEvents";

HaxballJS.then((HBInit) => {
	const room = HBInit({
		roomName: "FUTURO X4 - TESTANDO BOT",
		playerName: "criador do haxball 2.0",
		maxPlayers: 16,
		public: false,
		noPlayer: false,
		token: CONFIG.TOKEN,
	});
	
	RoomConfig.setRoom(room);
	RoomEvents.listenEvents(room)
});
