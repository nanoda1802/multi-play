import { getProtos } from "../../init/load-protos.js";
import attachHeader from "./attach-header.js";

/* 패킷 생성하기 */
const createPacket = (payload, packetName, packetType) => {
  // [1] 패킷 정체 파악하기 (packetName은 "game.CreateGame" 이런 형태)
  const [Package, Name] = packetName.split(".");
  // [2] 프로토 메세지 가져오기
  const protoMessages = getProtos();
  const Proto = protoMessages[Package][Name];
  // [2] 응답 객체 버퍼로 변환
  console.log("Proto : ", Proto);
  const message = Proto.create(payload);
  console.log("message : ", message);
  const packet = Proto.encode(message).finish();
  // [3] 헤더와 결합해 만든 패킷 반환
  return attachHeader({ packet, packetType });
};

export default createPacket;
