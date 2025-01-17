import config from "../../config/config.js";
import packetNames from "../../protobuf/packet-names.js";
import CustomError from "../../utils/error/customError.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import ChatManager from "../managers/chat-manager.js";
import IntervalManager from "../managers/interval-manager.js";

class Room {
  constructor(roomId) {
    this.id = roomId;
    this.users = new Map();
    this.chatManager = new ChatManager(roomId);
    this.intervalManager = new IntervalManager();
    this.state = `waiting`;
  }

  /* 룸에 유저 추가 */
  addUser(user) {
    if (this.users.length >= config.room.maxPlayer) {
      throw new CustomError(config.error.codes.roomIsFull, `${this.id}번 방은 이미 플레이어가 꽉 찼슴다!!`);
    }
    user.roomId = this.id;
    this.users.set(user.id, user);
    this.chatManager.addPlayer(user.id);
    // 사용자 핑 5초마다 체크
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 5000);
    // if (this.users.length >= config.room.minPlayer) {
    //   this.startGame();
    // }
  }

  /* 룸에서 유저 제거 */
  removeUser(userId) {
    this.users.delete(userId);
    this.chatManager.removePlayer(userId);
    // 인터벌 매니저에서도 제거
    this.intervalManager.removePlayer(userId);
    if (this.users.length < config.room.minPlayer) {
      this.state = `waiting`;
    }
  }

  /* 룸에 있는 유저 정보 열람 */
  getUser(userId) {
    return this.users.get(userId);
  }

  /* 룸 소속 유저들 기준 최대 지연시간 구하기 */
  getMaxLatency() {
    let maxLatency = 0;
    for (let user of this.users.values()) {
      maxLatency = maxLatency > user.latency ? maxLatency : user.latency;
    }
    // console.log(`${this.id}번 방의 최대 지연시간 : ${maxLatency}`);
    return maxLatency;
  }

  /* 룸 소속 유저들 전부의 위치 정보 구하기 */
  getAllLocation() {
    const users = [];
    this.users.forEach((user, userId) => {
      users.push({ userId, playerId: user.playerId, x: user.x, y: user.y });
    });
    return createPacket({ users }, packetNames.notice.LocationUpdate, config.packet.type.location);
  }

  /* (사용 X) 룸에 속한 유저들에게 게임시작 패킷 보내기 */
  startGame() {
    this.state = "inProgress";
    const payload = { roomId: this.id, timestamp: Date.now() };
    const startNotice = createPacket(payload, packetNames.notice.StartGame, config.packet.type.gameStart);
    // 모든 사용자에게 게임 시작 패킷 전송
    this.users.forEach((user) => {
      user.socket.write(startNotice);
    });
  }
}

export default Room;
