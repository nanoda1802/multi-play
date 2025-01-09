import fs from "fs";
import path from "path";
import pools from "../pool.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* 쿼리 실행 함수 */
const executeSqlFile = async (pool, filePath) => {
  // [1] 인자로 받은 경로에서 sql 파일 읽어옴
  const sql = fs.readFileSync(filePath, "utf8");
  // [2] sql 파일에 적힌 쿼리들 추출
  const queries = sql
    .split(";") // 세미콜론 기준으로 쿼리들 구분
    .map((query) => query.trim()) // 혹시 모를 공백 제거
    .filter((query) => query.length > 0); // 내용이 있는 쿼리만 남김
  // [3] 데이터베이스 풀에서 추출한 쿼리들 실행
  for (const query of queries) {
    await pool.query(query);
  }
};

/* 테이블 생성 함수 (= 스키마 형성) */
const createSchemas = async () => {
  // [1] 현 디렉토리 기준으로 sql 폴더 경로 얻음
  const sqlDir = path.join(__dirname, "../sql");
  // [2] 테이블 생성 시도
  try {
    // await executeSqlFile(pools.GAME_DB, path.join(sqlDir, "game_db.sql"));
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, "user_db.sql"));
    // 데이터베이스 추가 될 때마다 추가
    console.log(`테이블 생성 성공!!`);
  } catch (err) {
    console.error(`테이블 생성 실패!! : ${err}`);
  }
};

createSchemas()
  .then(() => {
    console.log("마이그레이션 무사히 완료!!");
    process.exit(0); // 0은 프로세스 정상 종료
  })
  .catch((err) => {
    console.error(`마이그레이션 실패!! : ${err}`);
    process.exit(1); // 0이 아니면 비정상 종료
  });
