/* 접속 중인 유저 관리 위한 세션 */
const userSession = [];

/* 유저 세션 가져오기 */
const getUserSession = () => {
  return userSession;
};

/* 신규 접속 유저 세션에 추가 */
const addUser = (userId, socket) => {
  const newUser = new User(userId, socket);
  userSession.push(newUser);
  return newUser;
};

/* 접속 해제 유저 세션에서 제거 */
const removeUser = (socket) => {
  const target = userSession.findIndex((user) => user.socket === socket);
  if (index !== -1) return userSession.splice(target, 1)[0];
};

/* 세션에서 아이디로 유저 찾기 */
const getUserById = (userId) => {
  return userSession.find((user) => user.id === userId);
};

/* 세션에서 소켓으로 유저 찾기 */
const getUserBySocket = (socket) => {
  return userSession.find((user) => user.socket === socket);
};

/* 유저의 다음 시퀀스 확인 */
const getNextSequence = (userId) => {
  const user = getUserById(userId);
  return user ? user.updateSequence() : null;
};

export { getUserSession, addUser, removeUser, getUserById, getUserBySocket, getNextSequence };
