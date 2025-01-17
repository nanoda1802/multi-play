import config from "../../config/config.js";
import { addUser } from "../../sessions/user-session.js";
import { createUser, findUserByDeviceId, updateUserLogin } from "../../database/user/user-db.js";
import packetNames from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import errorHandler from "../error/error-handler.js";
import { addRoom, getAllRooms, getRoom } from "../../sessions/room-session.js";

const initUserHandler = async ({ socket, userId, payload }) => {
  try {
    // [1] deviceId로 유저 찾아보기
    const { deviceId, playerId, latency } = payload;
    let user = await findUserByDeviceId(deviceId);
    // [2] 신규 유저면 db에 정보 생성하고, 기존 유저면 로그인 시킴
    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }
    // [3] 유저 세션에 해당 유저 추가 및 속성 추가
    user = addUser(user.id, socket, user.last_x, user.last_y);
    user.playerId = playerId;
    user.latency = latency;
    // [3-2] 게임 세션에도 참가
    const room = getRoom(config.room.id);
    room.addUser(user);
    // [4] 응답 데이터 준비
    const data = {
      userId: user.id,
      message: `게임에 접속하신 걸 환영합니다!!`,
      x: user.last_x,
      y: user.last_y,
    };
    // [5] 응답 페이로드 객체 만들기
    const responsePayload = {
      handlerId: config.handler.ids.initUser,
      responseCode: config.handler.responseCode.success,
      timestamp: Date.now(),
      data: Buffer.from(JSON.stringify(data)),
    };
    // [6] 응답 패킷 만들어 보내기
    const response = createPacket(responsePayload, packetNames.response.Response, config.packet.type.normal);
    socket.write(response);
  } catch (err) {
    errorHandler({ socket, userId, err });
  }
};

export default initUserHandler;
