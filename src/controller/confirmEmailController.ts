import { NextFunction, Request, Response } from 'express';
import { queryTokenValidation } from '../middlewares/validation/user.validator';
import { checkValidToken } from '../services/checkToken';

export const confirmEmailController = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = queryTokenValidation.validate(req.query, { abortEarly: false });

  if (error) return next({ data: error.details[0].message, status: 400 });

  if (await checkValidToken(value)) {
    res.setHeader('token', value.token);
    res.redirect('http://sluipgenius.pp.ua/getImage/7');
  } else {
    res.redirect('https://www.google.com');
  }
};
