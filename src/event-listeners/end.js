import { recordLastPosition } from "../database/user/user-db.js";
import { getRoom } from "../sessions/room-session.js";
import { getUserBySocket, getUserSession, removeUser } from "../sessions/user-session.js";

const onEnd = (socket) => async () => {
  console.log("!!! 종료 체크 !!!");
  // console.log("1) 세션 제거 전 : ", getUserSession());
  const user = getUserBySocket(socket);
  removeUser(socket);
  // console.log("2) 세션 제거 후 : ", getUserSession());
  const room = getRoom(user.roomId);
  // console.log("3) 룸 강퇴 전 : ", room);
  room.removeUser(user.id);
  console.log("4) 룸 강퇴 후 : ", room);
  socket.end();
  await recordLastPosition(user.id, user.x, user.y);
};

export default onEnd;
