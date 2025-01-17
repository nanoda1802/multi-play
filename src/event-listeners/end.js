import { recordLastPosition } from "../database/user/user-db.js";
import { getRoom } from "../sessions/room-session.js";
import { getUserBySocket, getUserSession, removeUser } from "../sessions/user-session.js";

const onEnd = (socket) => async () => {
  // console.log("!!! 종료 체크 !!!");
  // console.log("1) 세션 나가기 전 : ", getUserSession());
  const user = getUserBySocket(socket);
  removeUser(socket);
  // console.log("2) 세션 나가기 후 : ", getUserSession());
  const room = getRoom(user.roomId);
  // console.log("3) 룸 퇴실 전 : ", room);
  room.removeUser(user.id);
  // console.log("4) 룸 퇴실 후 : ", room);
  socket.end();
  socket.destroy();
  await recordLastPosition(user.id, user.x, user.y); // DB에 마지막 유저 위치 정보 기록
};

export default onEnd;
