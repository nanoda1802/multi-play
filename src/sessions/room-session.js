import Room from "../classes/models/room-model.js";

const roomSession = [];

const addRoom = (roomId) => {
  const newRoom = new Room(roomId);
  roomSession.push(newRoom);
  return newRoom;
};

const removeRoom = (roomId) => {
  const target = roomSession.findIndex((room) => room.id === roomId);
  if (target !== -1) return roomSession.splice(target, 1)[0];
};

const getRoom = (roomId) => {
  return roomSession.find((room) => room.id === roomId);
};

const getAllRooms = () => {
  return roomSession;
};

export { addRoom, removeRoom, getRoom, getAllRooms };
