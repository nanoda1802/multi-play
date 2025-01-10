const packetNames = {
  common: {
    Packet: `common.Packet`,
    Ping: `common.Ping`,
  },
  user: {
    CheckUser: `user.CheckUser`,
  },
  game: {
    CreateGame: `game.CreateGame`,
    JoinGame: `game.JoinGame`,
    UpdateLocation: `game.UpdateLocation`,
  },
  response: {
    ResponseMessage: `response.ResponseMessage`,
  },
  notice: {
    UpdateLocation: `notice.UpdateLocation`,
    StartGame: `notice.StartGame`,
  },
};

export default packetNames;
