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
    UpdateLocation: `game.UpdateLocation`,
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
