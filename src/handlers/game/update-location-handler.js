import config from "../../config/config.js";
import { getRoom } from "../../sessions/room-session.js";
import { getUserById } from "../../sessions/user-session.js";
import CustomError from "../../utils/error/customError.js";
import errorHandler from "../error/error-handler.js";

const updateLocationHandler = async ({ socket, userId, payload }) => {
  try {
    const { x, y } = payload;
    const user = getUserById(userId);

    if (!user) {
      throw new CustomError(config.error.codes.userNotFound, `유저를 찾을 수 없슴다!`);
    } else if (user.roomId === "") {
      throw new CustomError(config.error.codes.gameNotFound, `방에 참가하지 않은 유저임다!`);
    }

    const room = getRoom(user.roomId);
    const maxLatency = room.getMaxLatency();

    user.calculatePosition(maxLatency, x, y);

    const locationResponse = room.getAllLocation();

    socket.write(locationResponse);
  } catch (err) {
    console.error(err);
    errorHandler(socket, userId, err);
  }
};

export default updateLocationHandler;
