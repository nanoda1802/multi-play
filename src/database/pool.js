import mysql from "mysql2/promise";
import config from "../config/config.js";

/* 데이터베이스 커넥션 함수 - 풀 방식 */
const createPool = (db) => {
  // [1] 데이터베이스 풀 생성
  const pool = mysql.createPool({
    host: db.host,
    port: db.port,
    user: db.user,
    password: db.password,
    database: db.name,
    connectionLimit: 10, // 풀에 허용할 최대 연결 수
    waitForConnections: true, // 모든 연결을 사용 중일 때, 추가 연결 요청을 대기시킴
    queueLimit: 0, // 추가 연결 요청 대기열 무제한 (0은 무제한)
  });
  // [2] 풀 객체의 기존 쿼리 메서드 보관
  const originalQuery = pool.query;
  // [3] 쿼리 메서드에 로그 출력 기능 추가
  pool.query = (sql, params) => {
    const date = new Date();
    console.log(`${date}에 실행된 쿼리 : ${sql}`);
    console.log(`쿼리의 매개변수 : ${params ? `${JSON.stringify(params)}` : `none`}`);
    return originalQuery.call(pool, sql, params); // this를 pool에 바인딩 후 기존 쿼리 즉시 실행
  };
  // [4] 맞춤형 풀 반환
  return pool;
};

/* 데이터베이스 풀 보관 객체 */
const pools = {
  GAME_DB: createPool(config.database.GAME_DB),
  USER_DB: createPool(config.database.USER_DB),
};

export default pools;
