import config from "../../config/config.js";

/* 헤더 만들어 붙이기 */
const attachHeader = ({ message, type }) => {
  // [1] 환경변수에서 패킷 헤더 관련 정보 가져오기
  const { packet: packetConfig } = config;
  // [2] 패킷 총 길이 정보 -> 4 Byte 버퍼
  const packetTotalLength = Buffer.alloc(packetConfig.totalLength);
  packetTotalLength.writeUInt32BE(message.length + packetConfig.totalLength + packetConfig.typeLength);
  // [3] 패킷 타입 정보 -> 1 Byte 버퍼
  const packetType = Buffer.alloc(packetConfig.typeLength);
  packetType.writeUInt8(type || packetConfig.type.normal);
  // [4] 만든 두 헤더 버퍼와 페이로드 버퍼 합쳐 반환
  return Buffer.concat([packetTotalLength, packetType, message]);
};

export default attachHeader;
