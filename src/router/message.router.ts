import { Router } from 'express';
import { routes } from '../constraint/routes';
import { messageController } from '../controller/message.controller';

export const messageRouter = Router();

messageRouter
  .post(routes.CREATE, messageController.create)
  .get(routes.DEFAULT, messageController.get);
