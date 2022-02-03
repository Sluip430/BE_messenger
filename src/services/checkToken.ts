import { decodeToken } from './jwt';
import { user } from '../repository/user.repository';

export const checkValidToken = async (value) => {
  const { result, error } = decodeToken(value);

  if (error) return false;
  const { DBResult, DBError } = await user.getUserByEmail(result);

  return !!DBResult;
};
