import { Room } from "../classes/Room";

export default function playerChat() {
  let room = Room.getRoom();

  room.onPlayerJoin = (player) => {
    console.log(Room.getPlayers())
  }
  
}
