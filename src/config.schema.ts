import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  STATE: Joi.string().required(),
  SLACK_BEARER_TOKEN: Joi.string().required(),
  DAILY_MESSAGE_CHANNEL_ID: Joi.string().required(),
});
