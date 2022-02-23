import Joi from 'joi';

export const messageValidation = Joi.object().keys({
  text: Joi.string().min(1).required(),
  room_id: Joi.number().min(1).required(),
});

export const chatIdValidation = Joi.object().keys({
  page: Joi.number().min(1).default(1),
  perPage: Joi.number().min(1).default(100),
  room_id: Joi.number().min(1).required(),
});
