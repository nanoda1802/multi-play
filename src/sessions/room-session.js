import Room from "../classes/models/room-model.js";

/* 생성된 룸 관리 위한 세션 */
const roomSession = new Map(); // roomId가 key

/* 세션에 룸 생성하기 */
const addRoom = (roomId) => {
  const newRoom = new Room(roomId);
  roomSession.set(roomId, newRoom);
  return newRoom;
};

/* 세션에서 룸 제거하기 */
const removeRoom = (roomId) => {
  const target = roomSession.get(roomId);
  roomSession.delete(roomId);
  return target; // 못 찾으면 undefined 반환
};

/* 특정 룸 정보 열람하기 */
const getRoom = (roomId) => {
  return roomSession.get(roomId); // 못 찾으면 undefined 반환
};

/* 실행 중인 모든 룸 조회하기 */
const getAllRooms = () => {
  return Object.fromEntries(roomSession);
};

/* 룸 세션 비우기 */
const clearAllRooms = () => {
  roomSession.clear();
};

export { addRoom, removeRoom, getRoom, getAllRooms, clearAllRooms };
