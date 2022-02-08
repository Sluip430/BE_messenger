import express, { NextFunction, Request, Response } from 'express';
import { createConnection } from 'typeorm';
import config from './src/configurations/config';
import { router } from './src/router/router';
import { IError } from './src/Interface/Error';
import { routes } from './src/constraint/routes';

createConnection().then(async (connection) => {
  const app = express();

  app.use(express.json());

  app.use(routes.API, router);

  app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status);
    res.send(error);
  });

  app.listen(config.PORT, () => {
    console.log(`App listen port: ${config.PORT}`);
  });
});
