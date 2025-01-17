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

  /* 유저 위치 정보 갱신 */
  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.updatedAt = Date.now();
  }

  /* (사용 X) 유저 통신 시퀀스 증가시키기 */
  updateSequence() {
    return ++this.sequence;
  }

  /* 핑 패킷 송신 */
  ping() {
    if (this.pingCount >= 3) {
      onEnd(this.socket)(); // 세번의 핑 동안 퐁 없으면 연결 해제로 간주
      return;
    }
    const now = Date.now();
    const pingPacket = createPacket({ timestamp: now }, packetName.common.Ping, config.packet.type.ping);
    this.socket.write(pingPacket);
    console.log(`ping : ${this.id}`);
    this.pingCount += 1;
  }

  /* 수신한 퐁 패킷 처리 */
  pong(data) {
    this.pingCount = 0;
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2; // 레이턴시 최신화
    console.log(`pong(${this.latency}) : ${this.id}`);
  }

  /* 클라에서 보내준 방향 정보 바탕으로 이동 예측값 계산 */
  calculatePosition(latency, velocityX, velocityY) {
    const timeDiff = latency / 1000;
    const SPEED = 3; // 클라이언트 기준 캐릭터 이동속도
    const distanceX = SPEED * velocityX * timeDiff;
    const distanceY = SPEED * velocityY * timeDiff;
    this.updatePosition(this.x + distanceX, this.y + distanceY);
    return { x: this.x, y: this.y };
  }
}

export default User;
