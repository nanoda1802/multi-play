class BaseManager {
  constructor() {
    if (new.target === BaseManager) throw new TypeError(`베이스 매니저를 직접 생성할 수 없슴다!!`);
  }
  addPlayer(playerId, ...args) {}
  removePlayer(playerId) {}
  clearAll() {}
}

export default BaseManager;
