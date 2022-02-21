import Joi from 'joi';
import { UserGenderEnum } from '../../enum/user-gender.enum';

export const signUpValidation = Joi.object().keys({
  email: Joi.string().min(2).required(),
  password: Joi.string().min(2).required(),
});

export const queryTokenValidation = Joi.object().keys({
  token: Joi.string().min(2).required(),
});

export const additionalInfoValidation = Joi.object().keys({
  first_name: Joi.string().min(2).required(),
  last_name: Joi.string().min(2),
  date_of_birthday: Joi.date().required(),
  gender: Joi.string().min(2).valid(UserGenderEnum.MALE, UserGenderEnum.FEMALE).required(),
});

export const emailValidation = Joi.object().keys({
  email: Joi.string().min(2).required(),
});

export const passwordValidation = Joi.object().keys({
  password: Joi.string().min(2).required(),
});
