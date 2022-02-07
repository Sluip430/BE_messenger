import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();
const { SALT_BCRYPT } = process.env;

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, +SALT_BCRYPT);

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const result: boolean = await bcrypt.compare(password, hash);

  return result;
};
