import dotenv from 'dotenv';

dotenv.config();

export class ConfigurationService {
  static getCustomKey(key: string, thowError = true): string {
    const env = process.env[key];

    if (!env && thowError) {
      throw new Error(`Error ${key} key is missing on environment`);
    }

    return env;
  }
}
