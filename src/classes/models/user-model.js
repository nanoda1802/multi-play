import config from "../../config/config.js";
import onEnd from "../../event-listeners/end.js";
import packetName from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";

class User {
  constructor(userId, socket, initX, initY) {
    this.id = userId;
    this.socket = socket;
    this.roomId = "";
    this.x = initX;
    this.y = initY;
    this.pingCount = 0;
    this.sequence = 0; // (사용 X)
    this.updatedAt = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.updatedAt = Date.now();
  }

  // (사용 X)
  updateSequence() {
    return ++this.sequence;
  }

  ping() {
    if (this.pingCount >= 3) {
      onEnd(this.socket)();
      return;
    }
    const now = Date.now();
    const pingPacket = createPacket({ timestamp: now }, packetName.common.Ping, config.packet.type.ping);
    this.socket.write(pingPacket);
    console.log(`ping : ${this.id}`);
    this.pingCount += 1;
  }

  pong(data) {
    this.pingCount = 0;
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`pong(${this.latency}) : ${this.id}`);
  }

  // 클라에 맞게 수정해야함
  calculatePosition(latency, velocityX, velocityY) {
    const timeDiff = latency / 1000;
    const SPEED = 3;
    const distanceX = SPEED * velocityX * timeDiff;
    const distanceY = SPEED * velocityY * timeDiff;
    this.updatePosition(this.x + distanceX, this.y + distanceY);
    return { x: this.x, y: this.y };
  }
}

export default User;
