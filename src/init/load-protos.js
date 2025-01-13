import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import protobuf from "protobufjs";
import packetNames from "../protobuf/packet-names.js";

/* proto 데이터에 접근하는 과정 */
const __filename = fileURLToPath(import.meta.url); // [1] 현 파일의 시스템 경로
const __dirname = path.dirname(__filename); // [2] 시스템 경로에서 현 디렉토리 추출 (init 폴더)
const basePath = path.join(__dirname, `../protobuf`); // [3] protobuf 폴더로 경로 변경

/* proto 데이터 보관할 객체 */
let protos = {};

/* proto 파일들 경로 설정하는 함수 */
const getAllPaths = (base, pathList = []) => {
  // [1] protobuf 폴더의 내용물들 배열화
  const files = fs.readdirSync(base);
  // [2] 내용물 별로 경로 지정해 목록에 넣음
  files.forEach((file) => {
    const filePath = path.join(base, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllPaths(filePath, pathList); // 내용물이 폴더면 그 폴더의 내용물에 재귀 실행
    } else if (path.extname(file) === `.proto`) {
      pathList.push(filePath);
    }
  });
  return pathList;
};

/* proto 파일 경로들 목록 담는 변수 */
const protoPaths = getAllPaths(basePath);

/* proto 파일 불러와서 객체로 만드는 함수 */
// protos = { namespace01 : { type01 : "namespace01.type01" }, namespace02 : { type02 : "namespace02.type02" }, ... }
const loadProtos = async () => {
  try {
    const root = new protobuf.Root();
    await Promise.all(protoPaths.map((file) => root.load(file)));
    for (const [namespace, types] of Object.entries(packetNames)) {
      protos[namespace] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protos[namespace][type] = root.lookupType(typeName);
      }
    }
    console.log(`프로토 로드 성공!!`);
  } catch (err) {
    throw new Error(`프로토 로드 실패!! : ${err}`);
  }
};

/* protos 객체 데려오는 함수 */
const getProtos = () => {
  return { ...protos };
};

export { loadProtos, getProtos };
