import { userRepository } from '../../repository/user.repository';
import { forgotPasswordMail } from '../../helpers/sendGrid/sendMail';
import { generateAccessToken, generateSecretToken } from '../jwt';

export const forgotPasswordServices = async (value) => {
  const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

  if (DBError) return { error: { data: DBError.data, status: DBError.status } };
  if (!DBResult) {
    return { error: { data: 'Sorry we dont have account with this email', status: 404 } };
  }

  const token = generateSecretToken(DBResult);
  const { result, error } = await forgotPasswordMail(DBResult.data, token);

  if (error) return { error: { data: error.data, status: error.status } };

  return { result };
};
