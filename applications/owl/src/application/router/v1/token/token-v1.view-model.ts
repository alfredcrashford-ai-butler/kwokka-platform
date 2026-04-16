import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const TokenV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
      accountId: Joi.string().optional(),
    }),
  },

  GetById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  RevokeAccessByCorrelationId: {
    params: Joi.object({
      correlationId: Joi.string().required(),
    }),
  },

  RevokeAccessByAccountId: {
    params: Joi.object({
      accountId: Joi.string().required(),
    }),
  },

  RefreshAccess: {
    query: Joi.object({
      refreshToken: Joi.string().required(),
    }),
  },
};
