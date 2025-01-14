import {
  PORT,
  HOST,
  CLIENT_VERSION,
  DB1_HOST,
  DB1_PORT,
  DB1_USER,
  DB1_NAME,
  DB1_PASSWORD,
  DB2_NAME,
  DB2_USER,
  DB2_PASSWORD,
  DB2_HOST,
  DB2_PORT,
} from "./constants/env.js";
import { HANDLER_IDS, RESPONSE_CODE } from "./constants/handler.js";
import { PACKET_TOTAL_LENGTH, PACKET_TYPE_LENGTH, PACKET_TYPE } from "./constants/header.js";
import { ERROR_CODES } from "./constants/error.js";
import { MAX_PLAYER, MIN_PLAYER, ROOM_ID } from "./constants/room.js";

const config = {
  server: {
    port: PORT,
    host: HOST,
  },
  client: {
    version: CLIENT_VERSION,
  },
  packet: {
    totalLength: PACKET_TOTAL_LENGTH,
    typeLength: PACKET_TYPE_LENGTH,
    type: {
      gameStart: PACKET_TYPE.GAME_START,
      normal: PACKET_TYPE.NORMAL,
      ping: PACKET_TYPE.PING,
      location: PACKET_TYPE.LOCATION,
    },
  },
  handler: {
    responseCode: {
      success: RESPONSE_CODE.SUCCESS,
      fail: RESPONSE_CODE.FAIL,
    },
    ids: {
      error: HANDLER_IDS.ERROR,
      initUser: HANDLER_IDS.INIT_USER,
      createGame: HANDLER_IDS.CREATE_GAME,
      joinGame: HANDLER_IDS.JOIN_GAME,
      updateLocation: HANDLER_IDS.UPDATE_LOCATION,
    },
  },
  room: {
    maxPlayer: MAX_PLAYER,
    minPlayer: MIN_PLAYER,
    id: ROOM_ID,
  },
  database: {
    GAME_DB: {
      name: DB1_NAME,
      user: DB1_USER,
      password: DB1_PASSWORD,
      host: DB1_HOST,
      port: DB1_PORT,
    },
    USER_DB: {
      name: DB2_NAME,
      user: DB2_USER,
      password: DB2_PASSWORD,
      host: DB2_HOST,
      port: DB2_PORT,
    },
  },
  error: {
    codes: {
      unknownError: ERROR_CODES.UNKNOWN_ERROR,
      clientVersionMismatch: ERROR_CODES.CLIENT_VERSION_MISMATCH,
      unknownHandlerId: ERROR_CODES.UNKNOWN_HANDLER_ID,
      invalidSequence: ERROR_CODES.INVALID_SEQUENCE,
      packetDecodeFailed: ERROR_CODES.PACKET_DECODE_FAILED,
      packetStructureMismatch: ERROR_CODES.PACKET_STRUCTURE_MISMATCH,
      invalidPacket: ERROR_CODES.INVALID_PACKET,
      packetMissingFields: ERROR_CODES.PACKET_MISSING_FIELDS,
      userNotFound: ERROR_CODES.USER_NOT_FOUND,
      gameNotFound: ERROR_CODES.GAME_NOT_FOUND,
      roomIsFull: ERROR_CODES.ROOM_IS_FULL,
    },
  },
};

export default config;
