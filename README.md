# 멀티플레이 실습 프로젝트
### 개요
TCP 소켓 통신 기반의 서버를 구축해 멀티플레이 게임을 실습해보는 프로젝트입니다!!
주요 학습 대상으론 `소켓 통신`, 직렬화-역직렬화 바탕의 `바이트 배열 패킷 활용`, 멀티 플레이 `위치 동기화` 등이 있으며,
추가 도전으론 `채팅 기능`을 시도해보았습니다!!
---
### 디렉토리 구조
> 환경변수들을 일괄 관리하는 `config`, 프로토버프 정의를 위한 `protobuf`,
> DB 연동 및 조작을 위한 `database`는 추가 설명이 없으며,
> ❌ 표시된 디렉토리 및 파일은 사용되지 않고 있습니다!!
#### init
- 서버가 `listen` 상태에 진입하는 시점에 실행되는 파일들을 관리하는 디렉토리입니다!!
- DB 연결 상태를 체크하고, 프로토버프 정의를 로드하고, `게임 세션(=룸)`을 하나 생성하는 일 등을 수행합니다!!
```
📦init
 ┣ 📜init-server.js
 ┣ ❌load-assets.js
 ┗ 📜load-protos.js
```
#### event-listeners
- 소켓 통신을 위한 **이벤트 리스너**들을 관리하는 디렉토리입니다!!
- 클라이언트 첫 연결 시 나머지 다른 리스너들을 소켓에 등록하는 `connection.js`
- 소켓 통신 간 주고 받는 패킷 데이터에 대한 처리를 담당하는 `data.js`
- 클라이언트 연결 해제 시 필요한 처리를 담당하는 `end.js`
```
📦event-listeners
 ┣ 📜connection.js
 ┣ 📜data.js
 ┣ 📜end.js
 ┗ ❌error.js
```
#### handlers
- `Data` 이벤트에서 받은 패킷 중 `Normal` 타입인 녀석들의 처리를 담당하는 핸들러들이 위치한 디렉토리입니다!!
- 프로젝트에서 룸이 하나로 가정돼있는 관계로, `create`는 서버가 생성될 때 발생하고, `join`은 `init-user`에서 발생하기 때문에 사용되지 않고 있습니다!!
- **`user/init-user-handler.js`**
  - 클라이언트에서 보내준 `initial` 패킷을 기준으로, DB에서 유저 정보를 찾고, 기존 유저면 로그인, 신규 유저면 생성시켜줍니다!
  - 유저 세션, 즉 접속 중인 유저 목록에 해당 유저를 추가하고, 룸에도 해당 유저를 참가시킵니다!
  - 이후 `initialResponse`를 위한 페이로드를 만들어 패킷 생성 함수에 전달합니다!
- **`*game/update-location-handler.js*`**
  - 패킷에서 유저의 아이디를 받아 서버의 유저 세션에서 유저 정보를 열람하고, 이를 바탕으로 이 유저가 속한 룸을 찾습니다!!
  - 룸에 속한 유저들과 지속적으로 교류한 핑퐁을 바탕으로 최대 레이턴시를 구합니다!!
  - 패킷의 페이로드에서 받은 **방향 벡터**들과 앞서 구한 **최대 레이턴시**를 바탕으로 **유저의 좌표를 최신화**합니다!!
  - 룸에 속한 전체 유저의 위치를 파악해 패킷을 만들어 클라이언트에 돌려줍니다!!
```
📦handlers
 ┣ 📂error
 ┃ ┗ ❌error-handler.js
 ┣ 📂game
 ┃ ┣ ❌create-game-handler.js
 ┃ ┣ ❌join-game-handler.js
 ┃ ┗ 📜update-location-handler.js
 ┣ 📂user
 ┃ ┗ 📜init-user-handler.js
 ┗ 📜mapping.js
```
#### sessions
- 두 세션의 공통 사항으로, 세션 자체가 **Map 인스턴스**로 구성됩니다!!
  - Map은 **해시 형식**으로 값을 보관하기 때문에, 일반 배열이나 객체보다 원하는 요소에 접근하고 이를 관리하기에 유용합니다!!
  - 유저 세션은 `유저의 아이디와 소켓`을 key로 활용하며, 게임 세션은 `룸의 아이디`를 key로 활용합니다!!
  - value로 저장되는 값은 각각 `User 인스턴스`와, `Room 인스턴스`입니다!!
- 접속 중인 유저 전체 목록을 관리하고, 신규 유저를 추가하고, 나간 유저를 제거하는 등의 작업을 하는 `user-session.js`
- 운영 중인 룸 전체 목록을 관리하고, 신규 룸을 생성하고, 비어버린 룸을 제거하는 등의 작업을 하는 `room-session.js`
```
📦sessions
┣ 📜room-session.js
┗ 📜user-session.js
```
#### classes
- **managers**
  - 게임 내 관리를 위한 부모 클래스인 `base-manager.js`
  - 유저에게서 받은 채팅 메세지를 서버 로그에 저장하고, 이를 에코 메세지로 룸에 속한 모든 유저에게 되돌려주는 `chat-manager.js`
  - 유저가 게임을 시작한 순간부터 주기적으로 핑-퐁을 주고받으며 레이턴시를 최신화해주는 `interval-manager.js`
- **models**
  - **룸**
    - 최소 1명, 최대 5명의 유저가 참가해 교류할 수 있는 게임 세션
    - 주요 속성으론 참가 유저들을 Map 인스턴스로 관리하는 `users`, 위의 두 매니저 인스턴스를 담는 `chatManager`, `intervalManager`가 있습니다!!
    - 주요 메서드로는 참가 유저들 중 최대 지연시간을 구하는 `getMaxLatency`와, 참가 유저들 각각의 좌표를 얻는 `getAllLocation`이 있습니다!!
  - **유저**
    - 인터벌 매니저에서 실행할 ping과 pong 메서드, 유저의 현재 위치를 update하거나, 다음 위치를 calculate하는 메서드 등이 있습니다!
```
📦classes
┣ 📂managers
┃ ┣ 📜base-manager.js
┃ ┣ 📜chat-manager.js
┃ ┗ 📜interval-manager.js
┗ 📂models
┃ ┣ 📜room-model.js
┃ ┗ 📜user-model.js
```
#### utils
- 빈출 오류를 가독성 좋게 확인하기 위한 `customError.js`
- 일괄적으로 패킷을 만들고 헤더를 붙이는 작업을 위한 `make-packet` 디렉토리
- 클라이언트가 보내준 패킷들의 페이로드를 추출하고, 바이트 배열을 디코딩하는 `packet-parser.js`
```
📦utils
 ┣ 📂error
 ┃ ┗ 📜customError.js
 ┣ 📂make-packet
 ┃ ┣ 📜attach-header.js
 ┃ ┗ 📜create-packet.js
 ┣ 📂parser
 ┃ ┗ 📜packet-parser.js
 ┗ ❌test-db
 ┃ ┗ ❌test-database.js
```
---
### 패킷 구조
- 패킷은 Node.js의 `Buffer` 라이브러리를 통해 바이트 배열로 직렬화-역직렬화하여 통신합니다!!
- 바이너리 형태로 주고받음으로써, 호스트들의 데이터 송수신 및 연산 효율이 증대됩니다!!
- 패킷의 헤더는 패킷의 `총길이 정보`를 위한 4 Byte, 패킷의 `타입 정보`를 위한 1 Byte이며,
- 페이로드는 유동적인 크기의 Byte로 구성됩니다!!
- - -
### 데이터베이스
- MySql을 사용해 기록이 필요한 유저 정보를 저장했으며, 프로젝트 연동은 Docker 컨테이너 형태로 적용했습니다!!
- User 테이블의 컬럼으론 id, device_id, last_x, last_y, last_login, created_at이 있으며, 현재 클라이언트 코드와의 최적화를 위해 id와 device_id를 동일한 값으로 활용하고 있다는 아쉬움이 있습니다!!
