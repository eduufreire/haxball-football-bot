import { mainStadium } from "../stadiums/mainStadium";

export class Room {
  private static room: RoomObject;

  private constructor() {}

  public static setRoom(newRoom: RoomObject): void {
    if (!Room.room) {
      Room.room = newRoom;
      Room.configRoom();
    }
  }

  public static getRoom(): RoomObject {
    return Room.room;
  }

  private static configRoom(): void {
    Room.room.setCustomStadium(JSON.stringify(mainStadium));
    Room.room.setScoreLimit(1);
    Room.room.setTimeLimit(3);
    Room.room.setTeamsLock(true);
  }

  public static getPlayers(): Array<PlayerObject> {
    return Room.room.getPlayerList();
  }
}
