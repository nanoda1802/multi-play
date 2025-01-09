import { getProtos } from "../../init/load-protos.js";
import { getNextSequence } from "../../sessions/user-session.js";
import config from "../../config/config.js";

// 주석 달자
const createResponsePacket = (handlerId, responseCode, data = null, userId) => {
  const protos = getProtos();
  const response = protos.response.ResponseMessage;

  const payload = {
    handlerId,
    responseCode,
    timestamp: Date.now(),
    data: data ? Buffer.from(JSON.stringify(data)) : null,
    sequence: userId ? getNextSequence(userId) : 0,
  };

  const responseBuffer = response.encode(payload).finish();

  const packetTotalLength = Buffer.alloc(config.packet.totalLength);
  packetTotalLength.writeUInt32BE(responseBuffer.length + config.packet.totalLength + config.packet.typeLength);

  const packetType = Buffer.alloc(config.packet.typeLength);
  packetType.writeUInt8(config.packet.type.normal);

  return Buffer.concat([packetTotalLength, packetType, responseBuffer]);
};

export default createResponsePacket;
