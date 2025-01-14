import config from "../../config/config.js";
import packetName from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";

class User {
  constructor(userId, socket, initX, initY) {
    this.id = userId;
    this.socket = socket;
    this.room = "";
    this.x = initX;
    this.y = initY;
    this.sequence = 0; // (사용 X)
    this.updatedAt = Date.now();
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y;
    this.updatedAt = Date.now();
  }

  // (사용 X)
  updateSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();
    const pingPacket = createPacket({ timestamp: now }, packetName.common.Ping, config.packet.type.ping);
    this.socket.write(pingPacket);
    console.log(`ping : ${this.id}`);
  }

  pong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`pong(${this.latency}) : ${this.id}`);
  }

  // 클라에 맞게 수정해야함
  calculatePos(latency) {
    const timeDiff = latency / 1000;
    const speed = 1;
    const distance = speed * timeDiff;
    return { x: this.x + distance, y: this.y };
  }
}

export default User;
