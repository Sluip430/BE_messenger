import { NextFunction, Request, Response } from 'express';
import {
  additionalInfoValidation,
  emailValidation, passwordValidation,
  queryTokenValidation,
  signUpValidation,
} from '../middlewares/validation/user.validator';
import { userRepository } from '../repository/user.repository';
import { decodeToken } from '../services/jwt';
import { checkValidToken } from '../services/checkToken';
import { authorizationServices } from '../services/authorization/authorization.services';

export class Controller {
  async signIn(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = signUpValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await authorizationServices.signIn(value);

    if (error) return next({ data: error.data, status: error.status });

    res.header('access-token', result.token);
    res.status(result.status).send(result.data);
  }
  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = emailValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await authorizationServices.forgotPassword(value);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result.data);
  }
  async mailChangePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    const { result, error } = await authorizationServices.mailChangePassword(value);

    if (error) return res.redirect('https://www.google.com');

    res.setHeader('confirmation-token', result.data);
    res.redirect('http://sluipgenius.pp.ua/getImage/8');
  }
  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = passwordValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });
    const { result, error } = await authorizationServices.changePassword(value, req.headers.token as string);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result.data);
  }
  async signUp(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = signUpValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError.details[0].message, status: 400 });

    const { result, error } = await authorizationServices.signUp(value);

    if (error) return next({ data: error.data, status: error.status });

    res.status(result.status).send(result);
  }
  async confirmEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

    if (error) return next({ data: error.details[0].message, status: 400 });

    const isValid = await checkValidToken(value);

    if (isValid) {
      res.setHeader('confirmation-token', value.token);
      res.redirect('http://sluipgenius.pp.ua/getImage/8');
    } else {
      res.redirect('https://www.google.com');
    }
  }
  async additionalInfo(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { value, error: validationError } = additionalInfoValidation.validate(req.body, { abortEarly: false });

    if (validationError) return next({ data: validationError, status: 400 });

    // const { result, error } = await decodeToken(req.headers.token as string, JWT);
    //
    // if (error) return next({ data: error, status: 401 });
    //
    // const { result: DBResult, error: DBError } = await userRepository.addInfoUser(value, result.id);
    //
    // if (DBError) return next({ data: DBError.data, status: 500 });
    //
    // const token = generateAccessToken(result);
    //
    // res.header('access-token', token);
    // res.status(DBResult.status).send(DBResult);
  }
}

export const authorizationController = new Controller();
