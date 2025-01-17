import config from "../../config/config.js";
import packetNames from "../../protobuf/packet-names.js";
import { getRoom } from "../../sessions/room-session.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import BaseManager from "./base-manager.js";

class ChatManager extends BaseManager {
  constructor(roomId) {
    super();
    this.roomId = roomId;
    this.chatSession = new Map();
  }

  addPlayer(userId) {
    this.chatSession.set(userId, new Map());
  }

  removePlayer(userId) {
    this.chatSession.delete(userId);
  }

  receiveChat(data) {
    const now = Date.now();
    console.log("03) 챗 매니저에 도착 : ", data);
    // 1) 클라이언트에서 패킷을 보냄 (userId, chat)
    // 2) 패킷 타입 : chat을 통해 data 이벤트에서 이 메서드 실행
    // 필요하다면 필터링....
    // 해당하는 아이디의 Map에 set(timestamp, message)
    this.chatSession.get(data.userId).set(now, data.message);
    this.sendEcho(data, now);
  }

  sendEcho(data, timestamp) {
    const echoPayload = { userId: data.userId, message: data.message, timestamp };
    console.log("04) 에코 준비중 : ", echoPayload);
    const echoPacket = createPacket(echoPayload, packetNames.chat.Echo, config.packet.type.chat);
    const room = getRoom(this.roomId);
    // 이때 룸에 속한 전체 유저에게 보내줌
    // socket.write 바로 반복
    room.users.forEach((user) => {
      user.socket.write(echoPacket);
    });
  }
}

export default ChatManager;
