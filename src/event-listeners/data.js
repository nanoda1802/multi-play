import config from "../config/config.js";

const onData = (socket) => async (data) => {
  // [1] 소켓의 버퍼 속성에 새로 받은 버퍼 데이터 이어붙입
  socket.buffer = Buffer.concat([socket.buffer, data]);
  // [2] 환경변수에서 패킷 헤더의 길이 확인
  const headerLength = config.packet.totalLength + config.packet.typeLength;
  // [3] 소켓의 버퍼가 헤더를 확인할 정도의 길이가 됐다면 데이터 판독 시작
  while (socket.buffer.length >= headerLength) {
    // [3-1] 버퍼에서 패킷의 총 길이와 타입에 대한 정보 읽어옴
    const packetLength = socket.buffer.readUInt32BE(); // 4 Byte -> UInt32
    const packetType = socket.buffer.readUInt8(config.packet.totalLength); // 1 Byte -> UInt8
    // [3-2 A] 버퍼에 패킷 전체 데이터가 들어왔다면 처리 시작!! (=버퍼의 길이가 패킷 총 길이 이상이면)
    if (socket.buffer.length >= packetLength) {
      // [A-1] 패킷에서 페이로드만 추출
      const payload = socket.buffer.slice(headerLength, packetLength);
      socket.buffer = socket.buffer.slice(packetLength);
      // [A-2] 패킷 타입에 따라 알맞은 핸들링
      switch (packetType) {
        case config.packet.type.gameStart:
          break;
        case config.packet.type.normal:
          break;
        case config.packet.type.ping:
          break;
        case config.packet.type.location:
          break;
      }
    } else {
      // [3-2 B] 아직 페이로드 바이트가 덜 들어왔다면 패스
      break;
    }
  }
};

export default onData;
