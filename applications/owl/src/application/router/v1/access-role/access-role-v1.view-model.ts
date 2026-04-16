import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const AccessRoleViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      accessRightsIds: Joi.array().items(Joi.string()).required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      accessRightsIds: Joi.array().items(Joi.string()),
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
