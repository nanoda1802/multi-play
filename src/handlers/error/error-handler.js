import config from "../../config/config.js";
import { getNextSequence } from "../../sessions/user-session.js";
import packetNames from "../../protobuf/packet-names.js";
import createPacket from "../../utils/make-packet/create-packet.js";

const errorHandler = ({ socket, err }) => {
  // [1] 서버에 오류 출력
  let errorCode = err.code;
  let message = err.message;
  console.error(`${errorCode}번 에러!! : ${message}`);
  // [2] 응답 데이터 준비
  const data = { message: `${errorCode}번 에러!! : ${message}` };
  // [3] 응답 페이로드 객체 만들기
  const responsePayload = {
    handlerId: config.handler.ids.error,
    responseCode: config.handler.responseCode.fail,
    timestamp: Date.now(),
    data: Buffer.from(JSON.stringify(data)),
    sequence: getNextSequence(userId),
  };
  // [4] 응답 패킷 만들어 보내기
  const response = createPacket(responsePayload, packetNames.response.ResponseMessage);
  socket.write(response);
};

export default errorHandler;
