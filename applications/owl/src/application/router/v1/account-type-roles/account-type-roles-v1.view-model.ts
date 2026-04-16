import Joi from 'joi';
import { AccountEntityType } from '@kwokka/entities';
import { QueryListViewModel } from '@kwokka/common-node';

export const AccountTypeRolesViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      type: Joi.string()
        .valid(...Object.values(AccountEntityType))
        .required(),
      accessRolesIds: Joi.array().items(Joi.string()).required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      type: Joi.string().valid(...Object.values(AccountEntityType)),
      accessRolesIds: Joi.array().items(Joi.string()),
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
