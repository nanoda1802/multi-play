/* USER_DB에서 사용할 쿼리문 모음 객체 */
const USER_QUERIES = {
  FIND_USER_BY_DEVICE_ID: "SELECT * FROM user WHERE device_id = ?",
  CREATE_USER: "INSERT INTO user (id, device_id) VALUES (?, ?)",
  UPDATE_USER_LOGIN: "UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?",
  RECORD_LAST_POSITION: "UPDATE user SET last_x = ?, last_y = ? WHERE id =?",
};

export default USER_QUERIES;
