import { GLOBALS } from "../config";
import { noGoalStadium } from "../stadiums/noGoalStadium";

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
        this.room.setCustomStadium(JSON.stringify(noGoalStadium));
        GLOBALS.IS_STADIUM_MAIN = false

        this.room.setScoreLimit(3);
        this.room.setTimeLimit(3);
        this.room.setTeamsLock(true);

        this.room.onRoomLink = (link) => console.log(link);
        this.room.startGame();
    }

    public static getPlayers(): Array<PlayerObject> {
        return this.room.getPlayerList();
    }
}
