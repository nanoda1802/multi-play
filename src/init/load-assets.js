import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

/* assets 데이터에 접근하는 과정 */
const __filename = fileURLToPath(import.meta.url); // [1] 현 파일의 시스템 경로
const __dirname = path.dirname(__filename); // [2] 시스템 경로에서 현 디렉토리 추출 (init 폴더)
const basePath = path.join(__dirname, `../../assets`); // [3] assets 폴더로 경로 변경

/* assets 데이터 보관할 객체 */
let assets = {};

/* assets의 JSON 데이터 읽고 객체로 변환하는 함수 */
const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    // assets 파일 이름을 인자로 받아 경로 완성
    fs.readFile(path.join(basePath, filename), `utf8`, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

/* assets 데이터를 위에 만든 객체에 넣는 함수 */
const loadAssets = async () => {
  const [stages, items, itemUnlocks] = await Promise.all([readFile(`stage.json`), readFile(`item.json`), readFile(`item_unlock.json`)]);
  assets = { stages, items, itemUnlocks };
  return assets;
};

/* assets 객체 데려오는 함수 */
const getAssets = () => {
  return { ...assets };
};

export { loadAssets, getAssets };
