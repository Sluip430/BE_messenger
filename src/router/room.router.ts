import { Router } from 'express';
import { routes } from '../constraint/routes';
import { roomController } from '../controller/room.controller';

export const roomRouter = Router();

roomRouter
  .get(routes.DEFAULT, roomController.get)
  .post(routes.CREATE, roomController.create)
  .post(routes.ADD_USER_TO_ROOM, roomController.addUserToChat);
