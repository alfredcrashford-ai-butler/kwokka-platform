import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';
import { ItemEntityActionEffectType, ItemEntityActionTrigger, ItemEntityRarity } from '@kwokka/entities';

const actionsSchema = Joi.array().items(
  Joi.object({
    trigger: Joi.string()
      .valid(...Object.values(ItemEntityActionTrigger))
      .required(),
    key: Joi.string().required(),
    effects: Joi.array()
      .items(
        Joi.object({
          type: Joi.string()
            .valid(...Object.values(ItemEntityActionEffectType))
            .required(),
          settings: Joi.object(),
        }),
      )
      .required(),
  }),
);

export const ItemV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
      ids: Joi.string(),
      keys: Joi.string(),
    }),
  },

  Create: {
    body: Joi.object({
      key: Joi.string().required(),
      applicationAccountId: Joi.string(),
      isTransferrable: Joi.boolean(),
      actions: actionsSchema,
      tags: Joi.array().items(Joi.string()),
      rarity: Joi.string()
        .valid(...Object.values(ItemEntityRarity))
        .required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string(),
      isTransferrable: Joi.boolean(),
      actions: actionsSchema,
      tags: Joi.array().items(Joi.string()),
      rarity: Joi.string().valid(...Object.values(ItemEntityRarity)),
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

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  GetItemInstanceByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  GetItemInstanceByItemKey: {
    params: Joi.object({
      key: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  GetOwnItemInstanceByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  GetOwnItemInstanceByItemKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
  },

  GiveItemInstanceByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      accountId: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    }),
  },

  TakeItemInstanceByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      accountId: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    }),
  },

  GiveItemInstanceByItemKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
    body: Joi.object({
      accountId: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    }),
  },

  TakeItemInstanceByItemKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
    body: Joi.object({
      accountId: Joi.string().required(),
      quantity: Joi.number().integer().required(),
    }),
  },

  RunOwnActionByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string().required(),
    }),
  },

  RunOwnActionByItemKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string().required(),
    }),
  },

  RunActionByItemId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string().required(),
    }),
  },

  ListItemInstancesByAccountId: {
    params: Joi.object({
      accountId: Joi.string().required(),
    }),
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  ListOwnItemInstances: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },
};
