import { v4 as uuidv4 } from "uuid";
import config from "../../config/config.js";
import { addRoom } from "../../sessions/room-session.js";
import { getUserById } from "../../sessions/user-session.js";
import { getNextSequence } from "../../sessions/user-session.js";
import packetNames from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import CustomError from "../../utils/error/customError.js";
import errorHandler from "../error/error-handler.js";

/* 게임 방 생성 요청 핸들러 */
const createGameHandler = async ({ socket, userId, payload }) => {
  try {
    // [1] 신규 룸 아이디 생성 후 룸 세션에 추가
    const roomId = uuidv4();
    const room = addRoom(roomId);
    // [2] 룸 생성한 유저 찾아서 룸 인스턴스에 넣어주기
    const user = getUserById(userId);
    if (!user) throw new CustomError(config.error.codes.userNotFound, `찾을 수 없는 유저임다!!`);
    room.addUser(user);
    // [3] 응답 데이터 준비
    const data = {
      roomId,
      message: `게임 룸이 생성됐슴다!! : ${roomId}`,
    };
    // [4] 응답 페이로드 객체 만들기
    const responsePayload = {
      handlerId: config.handler.ids.createGame,
      responseCode: config.handler.responseCode.success,
      timestamp: Date.now(),
      data: Buffer.from(JSON.stringify(data)),
      sequence: getNextSequence(userId),
    };
    // [5] 응답 패킷 만들어 보내기
    const response = createPacket(responsePayload, packetNames.response.Response, config.packet.type.normal);
    socket.write(response);
  } catch (err) {
    errorHandler({ socket, userId, err });
  }
};

export default createGameHandler;
