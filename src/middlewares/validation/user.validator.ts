import Joi from 'joi';

export const signUpValidation = Joi.object().keys({
  email: Joi.string().min(2).required(),
  password: Joi.string().min(2).required(),
});
