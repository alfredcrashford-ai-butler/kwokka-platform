import Joi from 'joi';
import { GameController } from './game-controller';

export const GameServerConfigSchema = Joi.object({
  path: Joi.string().required(),
  host: Joi.string()
    .pattern(/https?:\/\//)
    .required(),
  controller: Joi.object().instance(GameController).required(),
  persistOnShutdown: Joi.boolean().required(),
  autoPersist: Joi.object({
    enabled: Joi.boolean().required(),
    threshold: Joi.number().positive(),
  }).required(),
  autoCleanup: Joi.object({
    enabled: Joi.boolean().required(),
    crontab: Joi.string().required(),
  }).required(),
});
