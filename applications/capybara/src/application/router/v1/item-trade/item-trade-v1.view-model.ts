import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';

export const ItemTradeV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      itemId: Joi.string().required(),
      key: Joi.string().required(),
      quantity: Joi.number().required(),
      maxQuantity: Joi.number(),
      tradedItemId: Joi.string().required(),
      tradedItemQuantity: Joi.number().required(),
      requiredItems: Joi.array().items(Joi.object({ itemId: Joi.string().required(), quantity: Joi.number() })),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      itemId: Joi.string(),
      key: Joi.string(),
      quantity: Joi.number(),
      maxQuantity: Joi.number(),
      tradedItemId: Joi.string(),
      tradedItemQuantity: Joi.number(),
      requiredItems: Joi.array().items(Joi.object({ itemId: Joi.string().required(), quantity: Joi.number() })),
    }),
  },

  GetById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  GetByKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
  },

  RunOwnById: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  RunOwnByKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
