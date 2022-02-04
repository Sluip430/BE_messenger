import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';

export const checkValidToken = async (value) => {
  const { result, error } = decodeToken(value);

  if (error) return false;
  const DBResult = await userRepository.getUserByEmailTime(result);

  return DBResult;
};

export const getUserIdFromToken = async (token) => decodeToken(token);
