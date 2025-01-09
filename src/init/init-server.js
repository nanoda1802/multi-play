import { loadAssets } from "./load-assets.js";
import { loadProtos } from "./load-protos.js";
import testAllDatabases from "../utils/test-db/test-connection.js";
import pools from "../database/pool.js";

/* 서버 시작 준비 함수 */
const initServer = async () => {
  await loadAssets();
  // await loadProtos();
  await testAllDatabases(pools);
};

export default initServer;
