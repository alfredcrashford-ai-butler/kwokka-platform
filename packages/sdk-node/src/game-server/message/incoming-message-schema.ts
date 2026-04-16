import Joi from 'joi';
import { IncomingMessageType } from './incoming-message';

const cmdMessageDataSchema = Joi.alternatives().conditional('type', {
  is: IncomingMessageType.PlayerAction,
  then: Joi.object({
    name: Joi.string().required(),
    data: Joi.any().required(),
  }).required(),
});

const payloadSchema = Joi.alternatives().conditional('type', {
  is: 'cmd',
  then: Joi.object({
    type: Joi.string()
      .valid(...Object.values(IncomingMessageType))
      .required(),
    data: cmdMessageDataSchema,
  }).required(),
  otherwise: null,
});

export const IncomingMessageSchema = Joi.object({
  type: Joi.string().valid('cmd', 'ping').required(),
  payload: payloadSchema,
});
