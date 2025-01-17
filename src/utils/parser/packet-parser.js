import { getProtos } from "../../init/load-protos.js";
import config from "../../config/config.js";
import CustomError from "../error/customError.js";
import { getPacketNameById } from "../../handlers/mapping.js";
import { getUserById, getUserBySocket } from "../../sessions/user-session.js";
import { getRoom } from "../../sessions/room-session.js";

const errorCodes = config.error.codes;

/* 일반 패킷 파싱 */
const normalPacketParser = (data) => {
  // [1] 일반 패킷의 프로토버프 정의 바탕으로 패킷 디코드
  const protoMessages = getProtos();
  const packet = protoMessages.common.CommonPacket;
  let decodedPacket;
  try {
    decodedPacket = packet.decode(data);
  } catch (err) {
    throw new CustomError(errorCodes.packetDecodeFailed, `패킷 디코딩 실패!! : ${err}`);
  }
  // [2] 패킷에서 추출한 정보 검증
  const { handlerId, userId, clientVersion } = decodedPacket;
  if (clientVersion !== config.client.version) throw new CustomError(errorCodes.clientVersionMismatch, `클라이언트 버전 불일치!!`);
  const packetName = getPacketNameById(handlerId);
  if (!packetName) throw new CustomError(errorCodes.unknownHandlerId, `핸들러 아이디를 찾을 수 없슴다!!`);
  // [3] 추출한 패킷 이름으로 페이로드 형태 매핑
  const [namespace, typeName] = packetName.split(".");
  const payloadType = protoMessages[namespace][typeName];
  // [4] 페이로드 디코드
  let receivedPayload;
  try {
    receivedPayload = payloadType.decode(decodedPacket.payload);
  } catch (err) {
    throw new CustomError(errorCodes.packetStructureMismatch, `패킷 구조가 잘못돼씀다!! ${err}`);
  }
  // [5] 페이로드 필드 구조 비교 검증
  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(receivedPayload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) throw new CustomError(errorCodes.packetMissingFields, `누락된 필드가 이씀다!! ${missingFields}`);
  // [6] 검증 및 파싱 완료된 결과 반환
  return { handlerId, userId, receivedPayload };
};

/* 퐁 패킷 파싱 */
const pongPacketParser = (data, socket) => {
  // [1] 퐁 패킷의 프로토버프 정의 바탕으로 패킷 디코드
  const protoMessages = getProtos();
  const packet = protoMessages.common.Ping;
  let decodedPacket;
  try {
    decodedPacket = packet.decode(data);
  } catch (err) {
    throw new CustomError(errorCodes.packetDecodeFailed, `패킷 디코딩 실패!! : ${err}`);
  }
  // [2] 퐁 보낸 유저 찾기
  const user = getUserBySocket(socket);
  if (!user) throw new CustomError(errorCodes.userNotFound, `유저를 찾을 수 없슴다!!`);
  // [3] 퐁 내용과 유저 반환
  return { decodedPacket, user };
};

/* 채팅 패킷 파싱 */
const chatPacketParser = (data) => {
  // [1] 채팅 패킷의 프로토버프 정의 바탕으로 패킷 디코드
  const protoMessages = getProtos();
  const packet = protoMessages.chat.ChatPayload;
  let chatData;
  try {
    chatData = packet.decode(data);
  } catch (err) {
    throw new CustomError(errorCodes.packetDecodeFailed, `패킷 디코딩 실패!! : ${err}`);
  }
  // [2] 채팅 보낸 유저 찾기
  const user = getUserById(chatData.userId);
  if (!user) throw new CustomError(errorCodes.userNotFound, `유저를 찾을 수 없슴다!!`);
  // [3] 그 유저가 속한 룸 찾기
  const chattingRoom = getRoom(user.roomId);
  // [4] 채팅 내용과 소속 룸 반환
  return { chatData, chattingRoom };
};

export { normalPacketParser, pongPacketParser, chatPacketParser };
