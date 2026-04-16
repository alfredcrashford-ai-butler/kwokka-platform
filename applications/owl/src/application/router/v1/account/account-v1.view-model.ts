import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';
import { AccountEntityType } from '@kwokka/entities';

export const AccountV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
      type: Joi.string().valid(...Object.values(AccountEntityType)),
    }),
  },

  SetActive: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      isActive: Joi.boolean().required(),
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
