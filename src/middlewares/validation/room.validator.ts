import Joi from 'joi';

export const createRoomValidation = Joi.object().keys({
  name: Joi.string().min(2).required(),
});

export const userIdChatIdValidation = Joi.object().keys({
  user_id: Joi.number().positive().required(),
  room_id: Joi.number().positive().required(),
});

export const getRoomsValidation = Joi.object().keys({
  name: Joi.string().default(''),
  id: Joi.number().positive(),
  page: Joi.number().positive().default(1),
  perPage: Joi.number().positive().default(50),
});
