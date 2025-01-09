import createResponsePacket from "../../utils/response/create-response.js";
import config from "../../config/config.js";

const errorHandler = ({ socket, userId, error }) => {
  let responseCode = error.code;
  let message = error.message;
  console.error(`${responseCode}번 에러!! : ${message}`);

  const errorResponse = createResponsePacket(config.handler.ids.error, responseCode, { message }, userId);
  socket.write(errorResponse);
};

export default errorHandler;
