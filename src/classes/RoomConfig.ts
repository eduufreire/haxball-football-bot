import { mainStadium } from "../stadiums/mainStadium";

export class RoomConfig {
	private static room: RoomObject;

	private constructor() {}

	public static setRoom(newRoom: RoomObject): void {
		if (!RoomConfig.room) {
			RoomConfig.room = newRoom;
			RoomConfig.configRoom();
		}
	}

	public static getRoom(): RoomObject {
		return RoomConfig.room;
	}

	private static configRoom(): void {
		RoomConfig.room.setScoreLimit(1);
		RoomConfig.room.setTimeLimit(2);
		RoomConfig.room.setCustomStadium(JSON.stringify(mainStadium));
		RoomConfig.room.setTeamsLock(true);
	}
}
