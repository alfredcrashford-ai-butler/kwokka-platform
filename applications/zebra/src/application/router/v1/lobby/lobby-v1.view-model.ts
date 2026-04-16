import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const LobbyV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      key: Joi.string().required(),
      gameId: Joi.string().required(),
      minPlayers: Joi.number().min(0).max(256).required(),
      maxPlayers: Joi.number().min(0).max(256).required(),
      config: Joi.object(),
      availableSince: Joi.string(),
      availableTill: Joi.string(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string().required(),
      minPlayers: Joi.number().min(0).max(256),
      maxPlayers: Joi.number().min(0).max(256),
      config: Joi.object(),
      availableSince: Joi.string(),
      availableTill: Joi.string(),
    }),
  },

  GetByKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
  },

  GetById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
