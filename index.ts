import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import config from './src/configurations/config';
import { router } from './src/router/router';
import { IError } from './src/Interface/Error';
import { routes } from './src/constraint/routes';

createConnection().then(async (connection) => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server);

  global.io = io;

  app.use(cors());
  app.use(express.json());

  app.use(routes.API, router);

  app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status);
    res.send(error);
  });

  // io.on('connection', (socket) => {
  //   console.log('a user connected');
  // });

  server.listen(config.PORT, () => {
    console.log(`App listen port: ${config.PORT}`);
  });
});
