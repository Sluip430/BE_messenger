import { createConnection } from 'typeorm';

export const connectDB = () => {
  createConnection().then((connection) => {
    console.log('Connect to DB');
  });
};
