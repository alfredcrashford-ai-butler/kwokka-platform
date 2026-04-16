import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const GameV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  GetGameStats: {},

  Create: {
    body: Joi.object({
      key: Joi.string().required(),
      applicationAccountId: Joi.string().required(),
      url: Joi.string(),
      tags: Joi.array().items(Joi.string()),
      availableSince: Joi.string(),
      availableTill: Joi.string(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string(),
      url: Joi.string(),
      tags: Joi.array().items(Joi.string()),
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

  GetGameStatsById: {
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
