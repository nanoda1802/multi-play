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

  ping() {}

  pong() {}

  calculatePos(latency) {}
}

export default User;
