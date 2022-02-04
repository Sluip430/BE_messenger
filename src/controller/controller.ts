import { NextFunction, Request, Response } from 'express';
import { signUpValidation } from '../middlewares/validation/user.validator';
import { signInServices } from '../services/authorization/signIn.services';

export class Controller {
  async signIn(req: Request, res: Response, next: NextFunction) {
    const { value, error: validationError } = signUpValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await signInServices(value);

    if (error) return next({ data: error.data, status: error.status });

    res.header('access-token', result.token);
    res.status(result.status).send(result.data);
  }
}

export const authorizationController = new Controller();
