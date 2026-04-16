import { Module } from '@kwokka/common-node';
import {
  GameMongoRepository,
  GameInstanceMongoRepository,
  LobbyMongoRepository,
  GameV1Router,
  GameInstanceV1Router,
  LobbyV1Router,
  GameV1Controller,
  GameInstanceV1Controller,
  LobbyV1Controller,
  RootRouter,
  V1RootRouter,
  ScheduleGameInstanceCleanupInitializer,
} from '../application';
import {
  GameRepository,
  GameInstanceRepository,
  LobbyRepository,
  ListGamesUsecase,
  CreateGameUsecase,
  UpdateGameUsecase,
  DeleteGameUsecase,
  GetGameByIdUsecase,
  GetGameByKeyUsecase,
  ListGameInstancesUsecase,
  CreateGameInstanceUsecase,
  UpdateGameInstanceUsecase,
  DeleteGameInstanceUsecase,
  GetGameInstanceByIdUsecase,
  ListLobbiesUsecase,
  CreateLobbyUsecase,
  UpdateLobbyUsecase,
  DeleteLobbyUsecase,
  GetLobbyByIdUsecase,
  GetLobbyByKeyUsecase,
  GetGameStatsUsecase,
} from '../usecase';

export class ZebraModule extends Module {
  public get components() {
    return [
      // usecase/ports
      { identifier: GameRepository, implementer: GameMongoRepository },
      { identifier: GameInstanceRepository, implementer: GameInstanceMongoRepository },
      { identifier: LobbyRepository, implementer: LobbyMongoRepository },

      // application/router
      RootRouter,
      V1RootRouter,
      GameV1Router,
      GameInstanceV1Router,
      LobbyV1Router,

      // initializers
      ScheduleGameInstanceCleanupInitializer,

      // application/controller
      GameV1Controller,
      GameInstanceV1Controller,
      LobbyV1Controller,

      // usecase/game
      ListGamesUsecase,
      CreateGameUsecase,
      UpdateGameUsecase,
      DeleteGameUsecase,
      GetGameByIdUsecase,
      GetGameByKeyUsecase,
      GetGameStatsUsecase,

      // usecase/game-instance
      ListGameInstancesUsecase,
      CreateGameInstanceUsecase,
      UpdateGameInstanceUsecase,
      DeleteGameInstanceUsecase,
      GetGameInstanceByIdUsecase,

      // usecase/lobby
      ListLobbiesUsecase,
      CreateLobbyUsecase,
      UpdateLobbyUsecase,
      DeleteLobbyUsecase,
      GetLobbyByIdUsecase,
      GetLobbyByKeyUsecase,
    ];
  }
}
