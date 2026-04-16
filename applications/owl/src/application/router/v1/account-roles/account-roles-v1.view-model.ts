import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

const accessRolesSchema = Joi.array().items(
  Joi.object({
    id: Joi.string().required(),
    enabled: Joi.boolean().required(),
  }),
);

export const AccountRolesViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      accountId: Joi.string().required(),
      accessRoles: accessRolesSchema.required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      accessRoles: accessRolesSchema,
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
