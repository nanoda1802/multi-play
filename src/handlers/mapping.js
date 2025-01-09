import config from "../config/config.js";
import checkUserHandler from "./user/check-user-handler.js";
import createGameHandler from "./game/create-game-handler.js";
import joinGameHandler from "./game/join-game-handler.js";
import updateLocationHandler from "./game/update-location-handler.js";
import CustomError from "../utils/error/customError.js";

/* 핸들러 관리 */
const handlers = {
  [config.handler.ids.checkUser]: {
    handler: checkUserHandler,
    packetName: `user.CheckUserPayload`,
  },
  [config.handler.ids.createGame]: {
    handler: createGameHandler,
    packetName: `game.CreateGamePayload`,
  },
  [config.handler.ids.joinGame]: {
    handler: joinGameHandler,
    packetName: `game.JoinGamePayload`,
  },
  [config.handler.ids.updateLocation]: {
    handler: updateLocationHandler,
    packetName: `game.UpdateLocationPayload`,
  },
};

/* 핸들러 아이디로 핸들러 찾는 함수 */
export const getHandlerById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(config.error.codes.unknownHandlerId, `${handlerId}번 핸들러는 없슴다!!`);
  }
  return handlers[handlerId].handler;
};

/* 핸들러 아이디로 패킷 이름 찾는 함수 */
export const getPacketNameById = (handlerId) => {
  if (!handlers[handlerId]) {
    throw new CustomError(config.error.codes.unknownHandlerId, `${handlerId}번 핸들러는 없슴다!!`);
  }
  return handlers[handlerId].packetName;
};
