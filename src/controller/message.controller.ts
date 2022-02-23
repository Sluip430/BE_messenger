import { NextFunction, Request, Response } from 'express';
import { messageServices } from '../services/message.services';
import { chatIdValidation, messageValidation } from '../middlewares/validation/message.validator';

class MessageController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = messageValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await messageServices.create(value, req.headers);

    if (error) return next({ data: error.data, status: 500 });

    res.status(result.status).send(result);
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = chatIdValidation.validate(req.query, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await messageServices.get(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result);
  }
}

export const messageController = new MessageController();
