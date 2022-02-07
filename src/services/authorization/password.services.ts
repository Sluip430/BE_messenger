import dotenv from 'dotenv';
import { userRepository } from '../../repository/user.repository';
import { forgotPasswordMail } from '../../helpers/sendGrid/sendMail';
import { decodeToken, decodeToken1, generateToken } from '../jwt';
import { hashPassword } from '../../bcrypt/bcryptPassword';

dotenv.config();

const { JWT_MAIL_KEY } = process.env;
const { JWT_ACCESS_KEY } = process.env;
const { JWT_CONFIRMATION_KEY } = process.env;

export const forgotPasswordServices = async (value) => {
  const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

  if (DBError) return { error: { data: DBError.data, status: DBError.status } };

  if (!DBResult.data) {
    return { error: { data: 'Sorry we dont have account with this email', status: 404 } };
  }

  const token = generateToken(DBResult.data, JWT_MAIL_KEY);
  const { result, error } = await forgotPasswordMail(DBResult.data, token);

  if (error) return { error: { data: error.data, status: error.status } };

  return { result };
};

export const mailChangePasswordServices = async (value) => {
  const { result: data, error: tokenError } = decodeToken(value);

  if (tokenError) return { error: { data: tokenError.data, status: tokenError.status } };

  const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.email);

  if (DBError) return { error: { data: DBError.data, status: DBError.status } };

  const result = generateToken(DBResult.data, JWT_CONFIRMATION_KEY);

  return { result: { data: result, status: 200 } };
};

export const changePasswordServices = async (value, headers) => {
  const { result: data, error: tokenError } = decodeToken1(headers.token, JWT_CONFIRMATION_KEY);

  if (tokenError) return { error: { data: tokenError.data, status: tokenError.status } };

  const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.email);

  if (DBError) return { error: { data: DBError.data, status: DBError.status } };

  const newPassword = await hashPassword(value.password);
  const { result, error } = await userRepository.updateUserPassword(DBResult.data, newPassword);

  if (error) return { error: { data: error.message, status: error.status } };

  return { result: { data: result, status: 200 } };
};
