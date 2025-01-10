import { loadAssets } from "./load-assets.js";
import { loadProtos } from "./load-protos.js";
import testAllDatabases from "../utils/test-db/test-database.js";
import pools from "../database/pool.js";

/* 서버 시작 준비 함수 */
const initServer = async () => {
  try {
    await loadAssets();
    await loadProtos();
    // await testAllDatabases(pools);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default initServer;
