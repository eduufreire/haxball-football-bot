import { mainStadium } from "../stadiums/mainStadium";

export class Room {
    private static room: RoomObject;

    private constructor() {}

    public static setRoom(newRoom: RoomObject): void {
        if(!this.room) {
            this.room = newRoom;
            this.configRoom();
        }
    }

    public static getRoom(): RoomObject {
        return this.room;
    }

    private static configRoom(): void {
        this.room.setCustomStadium(JSON.stringify(mainStadium));
        this.room.setScoreLimit(3);
        this.room.setTimeLimit(3);
        this.room.setTeamsLock(true);
    }

    public static getPlayers(): Array<PlayerObject> {
        return this.room.getPlayerList();
    }
}
