import { getProtos } from "../../init/load-protos.js";
import config from "../../config/config.js";
import CustomError from "../error/customError.js";
import { getPacketNameById } from "../../handlers/mapping.js";
import { getUserById, getUserBySocket } from "../../sessions/user-session.js";

const errorCodes = config.error.codes;

const normalPacketParser = (data) => {
  const protoMessages = getProtos();
  const packet = protoMessages.common.Packet;
  let decodedPacket;
  try {
    decodedPacket = packet.decode(data);
  } catch (err) {
    throw new CustomError(errorCodes.packetDecodeFailed, `패킷 디코딩 실패!! : ${err}`);
  }

  const { handlerId, userId, clientVersion, sequence } = decodedPacket;

  if (clientVersion !== config.client.version) throw new CustomError(errorCodes.clientVersionMismatch, `클라이언트 버전 불일치!! : ${err}`);

  const packetName = getPacketNameById(handlerId);
  if (!packetName) throw new CustomError(errorCodes.unknownHandlerId, `핸들러 아이디를 찾을 수 없슴다!! : ${err}`);

  const [namespace, typeName] = packetName.split(".");
  const payloadType = protoMessages[namespace][typeName];
  let receivedPayload;
  try {
    receivedPayload = payloadType.decode(decodedPacket.payload);
  } catch (err) {
    throw new CustomError(errorCodes.packetStructureMismatch, `패킷 구조가 잘못돼씀다!! ${err}`);
  }

  const expectedFields = Object.keys(payloadType.fields);
  const actualFields = Object.keys(receivedPayload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));
  if (missingFields.length > 0) throw new CustomError(errorCodes.packetMissingFields, `누락된 필드가 이씀다!! : ${err}`);

  const user = getUserById(userId);
  if (user && user.sequence !== sequence) throw new CustomError(errorCodes.invalidSequence, `시퀀스가 이상합니다!! : ${err}`);

  return { handlerId, userId, receivedPayload };
};

const pingPacketParser = (data, socket) => {
  const protoMessages = getProtos();
  const packet = protoMessages.common.Ping;
  let decodedPacket;
  try {
    decodedPacket = packet.decode(data);
  } catch (err) {
    throw new CustomError(errorCodes.packetDecodeFailed, `패킷 디코딩 실패!! : ${err}`);
  }

  const user = getUserBySocket(socket);
  if (!user) throw new CustomError(errorCodes.userNotFound, `유저를 찾을 수 없슴다!! : ${err}`);

  return { decodedPacket, user };
};

export { normalPacketParser, pingPacketParser };
