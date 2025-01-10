import BaseManager from "./base-manager.js";

class IntervalManager extends BaseManager {
  constructor() {
    super();
    this.intervals = new Map();
  }

  addPlayer(playerId, callback, interval, type = `user`) {
    if (!this.intervals.has(playerId)) {
      this.intervals.set(playerId, new Map());
    }
    this.intervals.get(playerId).set(type, setInterval(callback, interval));
  }

  addRoom(roomId, callback, interval) {
    this.addPlayer(roomId, callback, interval, `game`);
  }

  updatePlayerPosition(playerId, callback, interval) {
    this.addPlayer(playerId, callback, interval, `updatePosition`);
  }

  removePlayer(playerId) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      userIntervals.forEach((interval) => clearInterval(interval));
      this.intervals.delete(playerId);
    }
  }

  removeInterval(playerId, type) {
    if (this.intervals.has(playerId)) {
      const userIntervals = this.intervals.get(playerId);
      if (userIntervals.has(type)) {
        clearInterval(userIntervals.get(type));
        userIntervals.delete(type);
      }
    }
  }

  clearAll() {
    this.intervals.forEach((userIntervals) => {
      userIntervals.forEach((interval) => clearInterval(interval));
    });
    this.intervals.clear();
  }
}

export default IntervalManager;
