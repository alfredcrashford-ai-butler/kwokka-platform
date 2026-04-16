import Joi from 'joi';
import { EmailPasswordCredentialEntity } from '../../../../entity/credential.entity';

const captchaQuery = Joi.object({
  captcha: Joi.string().required(),
});

export const OnboardingV1ViewModel = {
  SignUpAnon: {
    query: captchaQuery,
  },

  SignInAnon: {
    body: Joi.object({
      id: Joi.string().required(),
    }),
  },

  SignUpEmail: {
    query: captchaQuery,
    body: Joi.object({
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string().min(6).max(30).required(),
    }),
  },

  SignInEmail: {
    body: Joi.object({
      email: Joi.string().email({ tlds: false }).required(),
      password: Joi.string()
        .min(EmailPasswordCredentialEntity.PasswordMinLength)
        .max(EmailPasswordCredentialEntity.PasswordMaxLength)
        .required(),
    }),
  },

  SignInSecret: {
    body: Joi.object({
      clientId: Joi.string().required(),
      secret: Joi.string().required(),
    }),
  },

  SignUpOauth2: {
    query: captchaQuery,
    body: Joi.object({
      accessToken: Joi.string().required(),
    }),
  },

  SignInOauth2: {
    body: Joi.object({
      accessToken: Joi.string().required(),
    }),
  },

  RestoreEmailCredential: {
    query: captchaQuery,
    body: Joi.object({
      email: Joi.string().required(),
    }),
  },

  CompleteRestoreEmailCredential: {
    body: Joi.object({
      token: Joi.string().required(),
      password: Joi.string().required(),
    }),
  },
};
