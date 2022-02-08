import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  IResult, IReturnError, IReturnIUser,
} from '../Interface/return.interface';
import { UserEntity } from '../entity/user.entity';
import { IUser } from '../Interface/user.interface';

dotenv.config();

export const generateToken = (data: IUser | UserEntity, key: string): string => {
  const { email, id } = data;

  return jwt.sign({ email, id }, key);
};

export const decodeToken = (token: string, key: string): IResult<IReturnIUser, IReturnError> => {
  try {
    return { result: jwt.verify(token, key) };
  } catch (error) {
    return { error };
  }
};
