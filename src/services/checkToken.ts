import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { IUser } from '../Interface/return.interface';

export const checkValidToken = async (value: IUser): Promise<boolean> => {
  const { result, error } = decodeToken(value);

  if (error) return false;
  const DBResult = await userRepository.getUserByEmailTime(result);

  return DBResult;
};

export const getUserIdFromToken = async (token: string): Promise<IUser> => decodeToken(token);
