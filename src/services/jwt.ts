import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET_KEY } = process.env;

export const geterateToken = (data: any) => {
  const { email, id } = data;

  const token = jwt.sign({ email, id }, JWT_SECRET_KEY);

  return token;
};

export const decodeToken = ({ token }: any) => {
  try {
    return { result: jwt.verify(token, JWT_SECRET_KEY) };
  } catch (error) {
    return { error };
  }
};
