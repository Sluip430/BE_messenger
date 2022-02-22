import bcrypt from 'bcrypt';
import { ConfigurationService } from '../../configurations/controller.config';

export const hashPassword = async (password: string): Promise<string> => bcrypt.hash(password, +ConfigurationService.getCustomKey('SALT_BCRYPT'));

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  const result: boolean = await bcrypt.compare(password, hash);

  return result;
};
