import Joi from 'joi';

export const messageValidation = Joi.object().keys({
  text: Joi.string().min(1).required(),
  room_id: Joi.number().min(1).required(),
});
