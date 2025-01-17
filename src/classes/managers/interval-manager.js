import BaseManager from "./base-manager.js";

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  /* 유저에게 인터벌 부여 */
  addPlayer(playerId, callback, interval, type = `user`) {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  // addRoom(roomId, callback, interval) {
  //   this.addPlayer(roomId, callback, interval, `game`);
  // }

  // updatePlayerPosition(playerId, callback, interval) {
  //   this.addPlayer(playerId, callback, interval, `updatePosition`);
  // }

  /* 인터벌 세션에서 유저 제거 */
  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((interval) => clearInterval(interval));
      this.intervals.delete(playerId);
    }
  }

  /* 유저의 인터벌 제거 */
  removeInterval(playerId, type = `user`) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  /* 인터벌 세션 클리어 */
  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((interval) => clearInterval(interval));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
