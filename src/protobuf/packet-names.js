const packetNames = {
  common: {
    CommonPacket: `common.CommonPacket`,
    Ping: `common.Ping`,
  },
  initial: {
    InitialPayload: `initial.InitialPayload`,
  },
  game: {
    CreateGame: `game.CreateGame`,
    JoinGame: `game.JoinGame`,
    LocationUpdatePayload: `game.LocationUpdatePayload`,
  },
  response: {
    Response: `response.Response`,
  },
  notice: {
    LocationUpdate: `notice.LocationUpdate`,
    StartGame: `notice.StartGame`,
  },
  chat: {
    ChatPayload: `chat.ChatPayload`,
    Echo: `chat.Echo`,
  },
};

export default packetNames;
