import Joi from 'joi';
import { QueryListViewModel, SortQueryListViewModel } from '@kwokka/common-node';
import { TraitType } from '@kwokka/entities';

export const TraitV1ViewModel = {
  // Trait

  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      key: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(TraitType))
        .required(),
      applicationAccountId: Joi.string().required(),
      defaultValue: Joi.any(),
      isOwnerEditable: Joi.boolean(),
      isPubliclyVisible: Joi.boolean(),
      config: Joi.object().allow(null),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      key: Joi.string(),
      type: Joi.string().valid(...Object.values(TraitType)),
      isOwnerEditable: Joi.boolean(),
      isPubliclyVisible: Joi.boolean(),
      config: Joi.object().allow(null),
      defaultValue: Joi.any(),
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

  ListTraitInstancesByTraitId: {
    query: Joi.object({
      ...QueryListViewModel,
      ...SortQueryListViewModel,
    }),
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  // Trait Instance

  GetTraitInstanceByTraitKey: {
    params: Joi.object({
      key: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  GetTraitInstanceByTraitId: {
    params: Joi.object({
      id: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  DeleteTraitInstanceByTraitKey: {
    params: Joi.object({
      key: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  DeleteTraitInstanceByTraitId: {
    params: Joi.object({
      id: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
  },

  UpdateTraitInstanceByTraitKey: {
    params: Joi.object({
      key: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
    body: Joi.object({
      value: Joi.any().required(),
    }),
  },

  UpdateTraitInstanceByTraitId: {
    params: Joi.object({
      id: Joi.string().required(),
      accountId: Joi.string().required(),
    }),
    body: Joi.object({
      value: Joi.any().required(),
    }),
  },

  UpdateOwnTraitInstanceByTraitId: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      value: Joi.any().required(),
    }),
  },

  UpdateOwnTraitInstanceByTraitKey: {
    params: Joi.object({
      key: Joi.string().required(),
    }),
    body: Joi.object({
      value: Joi.any().required(),
    }),
  },
};
