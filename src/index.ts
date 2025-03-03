import { CONFIG } from "./config";
import HaxballJS from "haxball.js";
import { RoomConfig } from "./classes/RoomConfig";
import RoomEvents from "./classes/RoomEvents";

HaxballJS.then((HBInit) => {
	const room = HBInit({
		roomName: CONFIG.ROOM.NAME,
		playerName: CONFIG.ROOM.BOT_NAME,
		maxPlayers: CONFIG.ROOM.MAX_PLAYERS,
		public: CONFIG.ROOM.IS_PUBLIC,
		noPlayer: CONFIG.ROOM.SHOW_BOT,
		token: CONFIG.TOKEN,
	});

	RoomConfig.setRoom(room);
	RoomEvents.listenEvents(room);
});
