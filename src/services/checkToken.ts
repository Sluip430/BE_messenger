import { decodeToken } from './jwt';
import { user } from '../repository/user.repository';

export const checkValidToken = async (value) => {
  const { result, error } = decodeToken(value);

  if (error) return false;
  const DBResult = await user.getUserByEmail(result);

  return DBResult;
};

export const getUserIdFromToken = async (token) => {
  const { result, error } = decodeToken(token);

  if (error) return { TokenError: { data: error.message, status: 400 } };

  return { result };
};
