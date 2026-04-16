export enum ZebraAccessRight {
  // Games
  CreateGame = 'CreateGame',
  UpdateGame = 'UpdateGame',
  DeleteGame = 'DeleteGame',
  ReadGame = 'ReadGame',
  ReadGameStats = 'ReadGameStats',

  // Game Instances
  CreateGameInstance = 'CreateGameInstance',
  ReadGameInstance = 'ReadGameInstance',
  UpdateGameInstance = 'UpdateGameInstance',
  DeleteGameInstance = 'DeleteGameInstance',

  // Lobbies
  CreateLobby = 'CreateLobby',
  ReadLobby = 'ReadLobby',
  UpdateLobby = 'UpdateLobby',
  DeleteLobby = 'DeleteLobby',

  // Connection
  GenerateConnectToken = 'GenerateConnectToken',
  ValidateConnectToken = 'ValidateConnectToken',

  // Game Management
  ManageGames = 'ManageGames',
  ManageGameInstances = 'ManageGameInstances',
}
