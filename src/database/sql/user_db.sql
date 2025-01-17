
CREATE TABLE IF NOT EXISTS user
(
    id         VARCHAR(36) PRIMARY KEY,  -- 사용자 ID, 기본 키
    device_id  VARCHAR(255) UNIQUE NOT NULL,  -- 장치 ID, 유일해야 함
    last_x FLOAT DEFAULT 0,
    last_y FLOAT DEFAULT 0,
    last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- 마지막 로그인 시간
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- 생성 시간
);
