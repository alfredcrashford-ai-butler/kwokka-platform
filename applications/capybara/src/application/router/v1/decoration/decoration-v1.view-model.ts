import Joi from 'joi';
import { QueryListViewModel } from '@kwokka/common-node';
import { DecorationEntityType } from '@kwokka/entities';

export const DecorationV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    body: Joi.object({
      applicationAccountId: Joi.string(),
      key: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(DecorationEntityType))
        .required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      applicationAccountId: Joi.string(),
      key: Joi.string(),
      type: Joi.string().valid(...Object.values(DecorationEntityType)),
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
};
