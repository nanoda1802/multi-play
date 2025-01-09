import { v4 as uuidv4 } from "uuid";
import pools from "../pool.js";
import USER_QUERIES from "./user-queries.js";

const findUserByDeviceId = async (deviceId) => {
  const [rows] = await pools.USER_DB.query(USER_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  // 케이스 변환 함수 적용해야해
  return rows[0];
};

const createUser = async (deviceId) => {
  const userId = uuidv4();
  await pools.USER_DB.query(USER_QUERIES.CREATE_USER, [userId, deviceId]);
  return { id: userId, deviceId };
};

const updateUserLogin = async (userId) => {
  await pools.USER_DB.query(USER_QUERIES.UPDATE_USER_LOGIN, [userId]);
};

export { findUserByDeviceId, createUser, updateUserLogin };
