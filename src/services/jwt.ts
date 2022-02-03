import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const { JWT_SECRET_KEY } = process.env;
// const token = jwt.sign({ foo: 'bar' }, 'shhhhh');

export const geterateToken = (data: any) => {
  const token = jwt.sign({ data }, JWT_SECRET_KEY);

  return token;
};

export const decodeToken = ({ token }: any) => {
  try {
    return { result: jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => decoded.data) };
  } catch (error) {
    return { error };
  }
};
