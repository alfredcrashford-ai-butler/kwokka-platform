import Joi from 'joi';
import { DecorationEntityType } from '@kwokka/entities';

const decorationsSchema = Joi.object().keys({
  [DecorationEntityType.Image]: Joi.string(),
  [DecorationEntityType.Background]: Joi.string(),
  [DecorationEntityType.Badge]: Joi.string(),
});

export const ProfileDecorationsV1ViewModel = {
  Create: {
    body: Joi.object({
      profileId: Joi.string().required(),
      decorations: decorationsSchema.required(),
    }),
  },

  CreateOwn: {
    body: Joi.object({
      decorations: decorationsSchema.required(),
    }),
  },

  Patch: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      decorations: decorationsSchema.required(),
    }),
  },

  PatchOwn: {
    body: Joi.object({
      decorations: decorationsSchema.required(),
    }),
  },

  GetByProfileId: {
    params: Joi.object({
      profileId: Joi.string().required(),
    }),
  },

  Delete: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },
};
