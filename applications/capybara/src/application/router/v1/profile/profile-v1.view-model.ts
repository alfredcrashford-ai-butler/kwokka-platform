import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const ProfileViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      accountId: Joi.string().required(),
      name: Joi.string().required(),
      locale: Joi.string().required(),
    }),
  },

  CreateOwn: {
    body: Joi.object({
      name: Joi.string().required(),
      locale: Joi.string().required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string(),
      locale: Joi.string(),
    }),
  },

  PatchOwn: {
    body: Joi.object({
      name: Joi.string(),
      locale: Joi.string(),
    }),
  },

  GetById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  GetByAccountId: {
    params: Joi.object({
      accountId: Joi.string().required(),
    }),
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
