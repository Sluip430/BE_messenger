import { userRepository } from '../../repository/user.repository';
import { comparePassword, hashPassword } from '../../bcrypt/bcryptPassword';
import { generateAccessToken } from '../jwt';

export const signInServices = async (value) => {
  const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

  if (DBError) return { error: { data: DBError.data, status: DBError.status } };

  const isActivated = Boolean(DBResult.data.activated_at);
  const isCorrect = await comparePassword(value.password, DBResult.data.password);

  if (!isCorrect) {
    return { error: { data: 'Login or password is wrong', status: 401 } };
  }

  if (!isActivated) {
    return { error: { data: 'Please verify your account ', status: 401 } };
  }

  const token = generateAccessToken(DBResult.data);
  const { result, error } = await userRepository.generateUserSession(value.email);

  if (error) return { error: { data: error.message, status: error.status } };

  return { result: { data: 'Successful Enter!', status: 200, token } };
};
