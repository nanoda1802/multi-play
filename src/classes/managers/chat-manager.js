import config from "../../config/config.js";
import packetNames from "../../protobuf/packet-names.js";
import { getRoom } from "../../sessions/room-session.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import BaseManager from "./base-manager.js";

class ChatManager extends BaseManager {
  constructor(roomId) {
    super();
    this.roomId = roomId;
    this.chatLog = new Map();
  }

  /* 채팅 로그에 유저 추가 */
  addPlayer(userId) {
    this.chatLog.set(userId, new Map());
  }

  /* 채팅 로그에서 유저 제거 */
  removePlayer(userId) {
    this.chatLog.delete(userId);
  }

  /* 채팅 로그에 저장하고 에코 메세지 준비 */
  receiveChat(data) {
    const now = Date.now();
    console.log("03) 챗 매니저에 도착 : ", data);
    // 필터링도 되면 좋은데....
    this.chatLog.get(data.userId).set(now, data.message);
    this.sendEcho(data, now);
  }

  /* 채팅한 유저가 속한 룸의 모든 유저에게 에코 챗 전송 */
  sendEcho(data, timestamp) {
    const echoPayload = { userId: data.userId, message: data.message, timestamp };
    console.log("04) 에코 준비중 : ", echoPayload);
    const echoPacket = createPacket(echoPayload, packetNames.chat.Echo, config.packet.type.chat);
    const room = getRoom(this.roomId);
    room.users.forEach((user) => {
      user.socket.write(echoPacket);
    });
  }
}

export default ChatManager;
