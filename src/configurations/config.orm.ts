import { ConfigurationService } from './controller.config';

export const getConfigORM = () => ({
  type: 'postgres',
  host: ConfigurationService.getCustomKey('DB_HOST'),
  port: 5432,
  username: ConfigurationService.getCustomKey('DB_USERNAME'),
  password: ConfigurationService.getCustomKey('DB_PASSWORD'),
  database: ConfigurationService.getCustomKey('DB_NAME'),
  entities: ['src/entity/*.ts'],
  logging: false,
  synchronize: true,
});
