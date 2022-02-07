import { NextFunction, Request, Response } from 'express';
import {
  emailValidation, passwordValidation,
  queryTokenValidation,
  signUpValidation,
} from '../middlewares/validation/user.validator';
import { signInServices } from '../services/authorization/signIn.services';
import {
  changePasswordServices,
  forgotPasswordServices,
  mailChangePasswordServices,
} from '../services/authorization/password.services';
import { hashPassword } from '../bcrypt/bcryptPassword';
import { userRepository } from '../repository/user.repository';
import { generateSecretToken } from '../services/jwt';
import { sendMMail } from '../helpers/sendGrid/sendMail';

export class Controller {
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = signUpValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await signInServices(value);

    if (error) return next({ data: error.data, status: error.status });

    res.header('access-token', result.token);
    res.status(result.status).send(result.data);
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = emailValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await forgotPasswordServices(value);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result.data);
  }
  async mailChangePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await mailChangePasswordServices(value);

    if (error) return res.redirect('https://www.google.com');

    res.setHeader('confirmation-token', result.data);
    res.redirect('http://sluipgenius.pp.ua/getImage/8');
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = passwordValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });
    console.log(req.headers);
    const { result, error } = await changePasswordServices(value, req.headers);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result.data);
  }
  async signUpController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });
    value.password = await hashPassword(value.password);

    const { DBResult, DBError } = await userRepository.createUser(value);

    if (DBError) return next({ data: DBError.data, status: 400 });

    const token = generateSecretToken(DBResult.data);
    const { MailerResult, MailerError } = await sendMMail(DBResult.data, token);

    if (MailerError) return next({ data: MailerError.data, status: MailerError.status });

    res.status(MailerResult.status).send(MailerResult);
  }
}

export const authorizationController = new Controller();
