import config from "../../config/config.js";
import { addUser, getNextSequence } from "../../sessions/user-session.js";
import { createUser, findUserByDeviceId, updateUserLogin } from "../../database/user/user-db.js";
import packetNames from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import errorHandler from "../error/error-handler.js";

const initUserHandler = async ({ socket, userId, payload }) => {
  try {
    // [1] deviceId로 유저 찾아보기
    const { deviceId } = payload;
    let user = await findUserByDeviceId(deviceId);
    // [2] 신규 유저면 db에 정보 생성하고, 기존 유저면 로그인 시킴
    if (!user) {
      user = await createUser(deviceId);
    } else {
      await updateUserLogin(user.id);
    }
    // [3] 유저 세션에 해당 유저 추가
    addUser(user.id, socket);

    // [4] 응답 데이터 준비
    const data = {
      userId: user.id,
      message: `게임에 접속하신 걸 환영합니다!! : ${user.id}`,
      x: 0, // 나중에 마지막 저장 위치 ㄱㄱ혀
      y: 0, // 나중에 마지막 저장 위치 ㄱㄱ혀
    };

    // [5] 응답 페이로드 객체 만들기
    const responsePayload = {
      handlerId: config.handler.ids.initUser,
      responseCode: config.handler.responseCode.success,
      timestamp: Date.now(),
      data: Buffer.from(JSON.stringify(data)),
      sequence: getNextSequence(userId),
    };

    // [6] 응답 패킷 만들어 보내기
    const response = createPacket(responsePayload, packetNames.response.Response, config.packet.type.normal);
    console.log("response : ", response);
    socket.write(response);
  } catch (err) {
    errorHandler({ socket, userId, err });
  }
};

export default initUserHandler;
