import config from "../../config/config.js";
import CustomError from "../../utils/error/customError.js";
import IntervalManager from "../managers/interval-manager.js";

class Room {
  constructor(roomId) {
    this.id = roomId;
    this.players = new Map();
    this.intervalManager = new IntervalManager();
    this.state = `waiting`;
  }

  addUser(user) {
    if (this.players.length >= config.room.maxPlayer) {
      throw new CustomError(config.error.codes.roomIsFull, `${this.id}번 방은 이미 플레이어가 꽉 찼슴다!!`);
    }
    this.players.set(user.id, user);
    // 사용자 핑 1초마다 체크 -> 내가 임의로 지정
    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.players.length === config.room.maxPlayer) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
    // 최대 인원 차면 겜 시작하는데, 나는 다르게 하고 싶당
    // 최소 인원만 되면 레디 상태 확인 후 방장이 겜 시작
  }

  removeUser(userId) {
    this.players.delete(userId);
    // 인터벌 매니저에서도 제거
    this.intervalManager.removePlayer(userId);
    if (this.users.length < config.room.maxPlayer) {
      this.state = `waiting`;
    }
  }

  getUser(userId) {
    return this.players.get(userId);
  }

  getMaxLatency() {}
  getAllLocation() {}

  startGame() {}
}

export default Room;
