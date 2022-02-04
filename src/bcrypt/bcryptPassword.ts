import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { SALT_BCRYPT } = process.env;

export const hashPassword = async (password) => bcrypt.hash(password, +SALT_BCRYPT);

export const comparePassword = async (password, hash) => {
  const result = await bcrypt.compare(password, hash);

  return result;
};
