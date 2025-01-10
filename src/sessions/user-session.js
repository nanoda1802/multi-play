/* 접속 중인 유저 관리 위한 세션 */
const userSocketSession = new Map(); // socket이 key
const userIdSession = new Map(); // userId가 key

/* 신규 접속 유저 세션에 추가 */
const addUser = (userId, socket) => {
  const newUser = new User(userId, socket);
  const userAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  userSocketSession.set(userAddress, newUser);
  userIdSession.set(userId, newUser);
  return newUser;
};

/* 접속 해제 유저 세션에서 제거 */
const removeUser = (socket) => {
  const userAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  const target = userSocketSession.get(userAddress);
  userSocketSession.delete(userAddress);
  userIdSession.delete(target.id);
  return target; // 못 찾으면 undefined 반환
};

/* 세션에서 아이디로 유저 찾기 */
const getUserById = (userId) => {
  return userIdSession.get(userId); // 못 찾으면 undefined 반환
};

/* 세션에서 소켓으로 유저 찾기 */
const getUserBySocket = (socket) => {
  const userAddress = `${socket.remoteAddress}:${socket.remotePort}`;
  return userSocketSession.get(userAddress); // 못 찾으면 undefined 반환
};

/* 유저의 다음 시퀀스 확인 */
const getNextSequence = (userId) => {
  const user = userIdSession.get(userId);
  return user ? user.updateSequence() : 0;
};

/* 유저 세션 가져오기 */
const getUserSession = () => {
  return Object.fromEntries(userIdSession);
};

/* 유저 세션 비우기 */
const clearUserSession = () => {
  userIdSession.clear();
  userSocketSession.clear();
};

export { getUserSession, addUser, removeUser, getUserById, getUserBySocket, getNextSequence, clearUserSession };
