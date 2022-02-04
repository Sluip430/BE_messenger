import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_MAIL_KEY } = process.env;
const { JWT_ACCESS_KEY } = process.env;

export const generateSecretToken = (data: any) => {
  const { email, id } = data;

  const token = jwt.sign({ email, id }, JWT_MAIL_KEY);

  return token;
};

export const generateAccessToken = (data: any) => {
  const { email, id } = data;

  const token = jwt.sign({ email, id }, JWT_ACCESS_KEY);

  return token;
};

export const decodeToken = ({ token }: any) => {
  try {
    return { result: jwt.verify(token, JWT_MAIL_KEY) };
  } catch (error) {
    return { error };
  }
};
