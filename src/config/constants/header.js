/* 패킷 총 길이 정보는 4 Byte */
export const PACKET_TOTAL_LENGTH = 4;

/* 패킷 타입 정보는 1 Byte */
export const PACKET_TYPE_LENGTH = 1;

/* 패킷 타입 매핑 */
export const PACKET_TYPE = {
  GAME_START: 1,
  NORMAL: 2,
  PING: 3,
  LOCATION: 4,
};
