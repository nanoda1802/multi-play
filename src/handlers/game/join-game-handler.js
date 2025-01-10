import config from "../../config/config.js";
import { getRoom } from "../../sessions/room-session.js";
import { getUserById, getNextSequence } from "../../sessions/user-session.js";
import packetNames from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";
import CustomError from "../../utils/error/customError.js";
import errorHandler from "../error/error-handler.js";

const joinGameHandler = async ({ socket, userId, payload }) => {
  try {
    // [1] 참가 요청한 방 찾기
    const { roomId } = payload;
    const room = getRoom(roomId);
    if (!room) throw new CustomError(config.error.codes.gameNotFound, `찾을 수 없는 방임다!!`);
    // [2] 참가 요청한 유저 찾기
    const user = getUserById(userId);
    if (!user) throw new CustomError(config.error.codes.userNotFound, `찾을 수 없는 유저임다!!`);
    // [3] 이미 참여 중인 방인지 확인하고 아니면 넣어줌
    const isExistUser = room.getUser(userId) ? true : false;
    if (!isExistUser) room.addUser(user);
    // [4] 응답 데이터 준비
    const data = {
      roomId,
      message: `게임 룸에 참가했슴다!! : ${roomId}`,
    };
    // [5] 응답 페이로드 객체 만들기
    const responsePayload = {
      handlerId: config.handler.ids.joinGame,
      responseCode: config.handler.responseCode.success,
      timestamp: Date.now(),
      data: Buffer.from(JSON.stringify(data)),
      sequence: getNextSequence(userId),
    };
    // [6] 응답 패킷 만들어 보내기
    const response = createPacket(responsePayload, packetNames.game.JoinGame);
    socket.write(response);
  } catch (err) {
    errorHandler({ socket, err });
  }
};

export default joinGameHandler;
