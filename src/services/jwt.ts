import jwt from 'jsonwebtoken';
import {
  IResult, IReturnError,
} from '../Interface/return.interface';
import { UserEntity } from '../entity/user.entity';
import { IUser } from '../Interface/user.interface';

export const generateToken = (data: IUser | UserEntity, key: string): string => {
  const { email, id } = data;

  return jwt.sign({ email, id }, key);
};

export const decodeToken = <TResult>(token: string, key: string): IResult<IUser, IReturnError> => {
  try {
    return { result: jwt.verify(token, key) };
  } catch (error) {
    return { error };
  }
};
