import { Router } from 'express';
import { routes } from '../constraint/routes';
import { authorizationRouter } from './authorization.router';
import { roomRouter } from './room.router';
import { messageRouter } from './message.router';

export const router = Router();

router.use(routes.USER, authorizationRouter);
router.use(routes.ROOM, roomRouter);
router.use(routes.MESSAGE, messageRouter);
