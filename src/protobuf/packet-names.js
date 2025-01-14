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
    UpdateLocation: `notice.LocationUpdate`,
    StartGame: `notice.StartGame`,
  },
};

export default packetNames;
