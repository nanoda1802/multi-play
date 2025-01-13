import config from "../../config/config.js";
import packetName from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";

class User {
  constructor(userId, socket) {
    this.id = userId;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.updatedAt = Date.now();
  }

  updatePos(x, y) {
    this.x = x;
    this.y = y;
    this.updatedAt = Date.now();
  }

  updateSequence() {
    return ++this.sequence;
  }

  ping() {
    const now = Date.now();
    const pingPacket = createPacket({ timestamp: now }, packetName.common.Ping, config.packet.type.ping);
    console.log(`ping : ${this.id}`);
    this.socket.write(pingPacket);
  }

  pong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`pong : ${this.id}`);
  }

  calculatePos(latency) {}
}

export default User;
