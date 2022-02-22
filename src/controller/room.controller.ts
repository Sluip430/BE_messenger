import { NextFunction, Request, Response } from 'express';
import { roomServices } from '../services/room.services';
import {
  createRoomValidation,
  getRoomsValidation,
  userIdChatIdValidation,
} from '../middlewares/validation/room.validator';

export class RoomController {
  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = getRoomsValidation.validate(req.query, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await roomServices.get(value, req.headers);

    if (error) return next({ data: error.message, status: 500 });

    res.status(result.status).send(result);
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = createRoomValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await roomServices.create(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result);
  }

  async addUserToChat(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = userIdChatIdValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    const { result, error: servicesError } = await roomServices.addUserToChat(value);

    if (servicesError) return next({ data: servicesError.message, status: 500 });

    res.status(result.status).send(result);
  }
}

export const roomController = new RoomController();
