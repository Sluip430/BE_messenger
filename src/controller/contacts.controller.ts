import { NextFunction, Request, Response } from 'express';
import {
  additionalInfoValidation,
  emailValidation, passwordValidation,
  queryTokenValidation,
  signUpValidation, userIdValidation,
} from '../middlewares/validation/user.validator';
import { authorizationServices } from '../services/authorization.services';
import { redirect } from '../constraint/redirect';
import { contactsServices } from '../services/contacts.services';

export class ContactsController {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = userIdValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await contactsServices.create(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result);
  }
}

export const contactsController = new ContactsController();
