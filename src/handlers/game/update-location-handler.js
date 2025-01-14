import { getRoom } from "../../sessions/room-session.js";
import errorHandler from "../error/error-handler.js";

const updateLocationHandler = async ({ socket, userId, payload }) => {
  try {
    const {x,y} = payload
    const room = getRoom()
  } catch (err) {
    errorHandler(socket, userId, err);
  }
};

export default updateLocationHandler;
