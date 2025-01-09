import net from "net";
import onConnection from "./event-listeners/connection.js";
import initServer from "./init/init-server.js";
import config from "./config/config.js";

/* TCP 서버 생성 */
// 인자로 받는 콜백함수는 connection 이벤트의 리스너
const server = net.createServer(onConnection);

/* 서버 초기화 및 실행하는 함수 */
const startServer = async () => {
  await initServer();
  server.listen(config.server.port, config.server.host, () => {
    console.log(`서버 시작!! : `, server.address());
  });
};

/* 서버 ON */
startServer();
