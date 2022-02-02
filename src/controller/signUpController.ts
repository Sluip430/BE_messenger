import { Request, Response, NextFunction } from 'express';
import { signUpValidation } from '../middlewares/validation/user.validator';
import { signUp } from '../repository/user.repository';

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

  if (error) return next({ data: error.details[0].message, status: 400 });

  const { result, DBerror } = await signUp(value);

  res.send(result);
};
