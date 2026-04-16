import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const AccessRightViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      name: Joi.string().required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      name: Joi.string(),
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
