import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  IResult, IReturnError, IReturnIUser, IReturnResult, IReturnUserEntity, IUser,
} from '../Interface/return.interface';
import { UserEntity } from '../entity/user.entity';

dotenv.config();

export const generateToken = (data: IUser | UserEntity, key: string): string => {
  const { email, id } = data;

  return jwt.sign({ email, id }, key);
};

export const decodeToken = (token: string, key: string): IResult<IReturnIUser, IReturnError> => {
  try {
    return { result: { data: jwt.verify(token, key), status: 200 } };
  } catch (error) {
    return { error: { data: error.message, status: error.status } };
  }
};
