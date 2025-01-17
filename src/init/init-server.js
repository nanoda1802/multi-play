import { loadAssets } from "./load-assets.js";
import { loadProtos } from "./load-protos.js";
import testAllDatabases from "../utils/test-db/test-database.js";
import pools from "../database/pool.js";
import config from "../config/config.js";
import { addRoom } from "../sessions/room-session.js";

/* 서버 시작 준비 함수 */
const initServer = async () => {
  try {
    await loadAssets(); // (사용 X) [1] JSON 에셋 데이터 로드
    await loadProtos(); // [2] 프로토버프 정의 데이터 로드
    await testAllDatabases(pools); // [3] DB 연동 확인
    addRoom(config.room.id); // [4] 룸 세션 만들기
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
