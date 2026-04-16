import Joi from 'joi';
import { DeepSearchViewModel, QueryListViewModel, SortQueryListViewModel } from '@kwokka/common-node';
import { GameInstanceEntityStatus } from '@kwokka/entities';

export const GameInstanceV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
      ...SortQueryListViewModel,
      gameId: Joi.string().required(),
      lobbyId: Joi.string(),
      playerIds: Joi.alternatives().try(Joi.array().items(Joi.string()), Joi.string()),
      status: Joi.string().valid(...Object.values(GameInstanceEntityStatus)),
      lobbySettings: DeepSearchViewModel,
      results: DeepSearchViewModel,
    }),
  },

  ListOwn: {
    query: Joi.object({
      ...QueryListViewModel,
      ...SortQueryListViewModel,
      gameId: Joi.string().required(),
      lobbyId: Joi.string(),
      status: Joi.string().valid(...Object.values(GameInstanceEntityStatus)),
      lobbySettings: DeepSearchViewModel,
      results: DeepSearchViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      gameId: Joi.string().required(),
      lobbyId: Joi.string().required(),
      lobbySettings: Joi.object().required(),
      isPubliclyVisible: Joi.boolean(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      gameId: Joi.string(),
      lobbyId: Joi.string(),
      lobbySettings: Joi.object(),
      status: Joi.string().valid(...Object.values(GameInstanceEntityStatus)),
      state: Joi.object(),
      playerIds: Joi.array().items(Joi.string()),
      startedAt: Joi.string(),
      finishedAt: Joi.string(),
      results: Joi.object(),
      isPubliclyVisible: Joi.boolean(),
    }),
  },

  GetById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  GenerateConnectToken: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  ValidateConnectToken: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      token: Joi.string().required(),
    })
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
