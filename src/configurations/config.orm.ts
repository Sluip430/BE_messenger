export const getConfigORM = () => ({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'sluip',
  password: 's12122000',
  database: 'postgres',
  entities: ['src/entity/*.ts'],
  logging: false,
  synchronize: true,
});
