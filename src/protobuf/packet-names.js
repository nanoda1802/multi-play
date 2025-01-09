const packetNames = {
  common: {
    Packet: `common.Packet`,
  },
  user: {
    CheckUserPayload: `user.CheckUserPayload`,
  },
  game: {
    CreateGamePayload: `game.CreateGamePayload`,
    JoinGamePayload: `game.JoinGamePayload`,
    UpdateLocationPayload: `game.UpdateLocationPayload`,
  },
  response: {
    ResponseMessage: `response.ResponseMessage`,
  },
  notice: {},
};

export default packetNames;
