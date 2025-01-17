import config from "../../config/config.js";
import { getRoom } from "../../sessions/room-session.js";
import { getUserById } from "../../sessions/user-session.js";
import CustomError from "../../utils/error/customError.js";
import errorHandler from "../error/error-handler.js";

/* 위치 갱신 요청 핸들러 */
const updateLocationHandler = async ({ socket, userId, payload }) => {
  try {
    // [1] 페이로드에서 방향 정보 추출
    const { x: vectorX, y: vectorY } = payload;
    // [2] 요청한 유저 찾기
    const user = getUserById(userId);
    if (!user) {
      throw new CustomError(config.error.codes.userNotFound, `유저를 찾을 수 없슴다!`);
    } else if (user.roomId === "") {
      throw new CustomError(config.error.codes.gameNotFound, `방에 참가하지 않은 유저임다!`);
    }
    // [3] 유저가 속한 룸 찾고 최대 지연시간 구하기
    const room = getRoom(user.roomId);
    const maxLatency = room.getMaxLatency();
    // [4] 유저 예상 위치 계산
    user.calculatePosition(maxLatency, vectorX, vectorY);
    // [5] 같은 룸에 속한 유저들 위치 정보로 패킷 생성
    const locationResponse = room.getAllLocation();
    // [6] 최신 위치 정보 패킷 반환
    socket.write(locationResponse);
  } catch (err) {
    console.error(err);
    errorHandler(socket, userId, err);
  }
};

export default updateLocationHandler;
