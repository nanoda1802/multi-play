import config from "../../config/config.js";
import CustomError from "../../utils/error/customError.js";

class Room {
  constructor(roomId) {
    this.id = roomId;
    this.players = [];
    this.intervalManager = null;
    this.state = `waiting`;
  }

  addPlayer(user) {
    if (this.players.length >= config.room.maxPlayer) {
      throw new CustomError(config.error.codes.roomIsFull, `${this.id}번 방은 이미 플레이어가 꽉 찼슴다!!`);
    }
    this.players.push(user);
    // 인터벌 매니저 핑 체크 시작하는 부분
    // 최대 인원 차면 겜 시작하는데, 나는 다르게 하고 싶당
    // 최소 인원만 되면 레디 상태 확인 후 방장이 겜 시작
  }

  removePlayer(userId) {
    this.players = this.players.filter((player) => player.id === userId);
    // 인터벌 매니저에서도 제거
  }

  getPlayer(userId) {
    return this.players.find((player) => player.id === userId);
  }

  getMaxLatency() {}
  getAllLocation() {}

  startGame() {}
}

export default Room;
