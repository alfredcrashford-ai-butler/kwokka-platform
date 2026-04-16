import Joi from 'joi';
import { CredentialEntityType } from '@kwokka/entities';
import { QueryListViewModel } from '@kwokka/common-node';

const credentialDataSchema = Joi.alternatives()
  .conditional('type', {
    is: CredentialEntityType.EmailPassword,
    then: Joi.object({ email: Joi.string().required(), password: Joi.string().required() }).required(),
  })
  .conditional('type', {
    is: CredentialEntityType.Secret,
    then: null,
  })
  .conditional('type', {
    is: CredentialEntityType.Anonymous,
    then: Joi.object({ accountId: Joi.string().required() }).required(),
    otherwise: null,
  });

const credentialIdentifierSchema = Joi.alternatives()
  .conditional('type', { is: CredentialEntityType.Discord, then: null })
  .conditional('type', { is: CredentialEntityType.Secret, then: null })
  .conditional('type', { is: CredentialEntityType.Google, then: null, otherwise: Joi.string().required() });

export const CredentialV1ViewModel = {
  List: {
    query: Joi.object({
      ...QueryListViewModel,
      accountId: Joi.string().optional(),
    }),
  },

  MyList: {
    query: Joi.object({
      ...QueryListViewModel,
    }),
  },

  Create: {
    query: Joi.object({
      oauthToken: Joi.string(),
    }),
    body: Joi.object({
      accountId: Joi.string().required(),
      type: Joi.string()
        .valid(...Object.values(CredentialEntityType))
        .required(),
      identifier: credentialIdentifierSchema,
      data: credentialDataSchema,
    }),
  },

  CreateOwn: {
    query: Joi.object({
      oauthToken: Joi.string(),
    }),
    body: Joi.object({
      type: Joi.string()
        .valid(...Object.values(CredentialEntityType))
        .required(),
      identifier: credentialIdentifierSchema,
      data: credentialDataSchema,
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

  VerifyCredential: {
    params: Joi.object({
      id: Joi.string().required(),
    }),
  },

  CompleteVerifyCredential: {
    params: Joi.object({
      id: Joi.string().required(),
    }),

    body: Joi.object({
      token: Joi.string().required(),
    }),
  },
};
