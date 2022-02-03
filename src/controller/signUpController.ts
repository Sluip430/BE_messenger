import { Request, Response, NextFunction } from 'express';
import { signUpValidation } from '../middlewares/validation/user.validator';
import { user } from ';

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

  if (error) return next({ data: error.details[0].message, status: 400 });

  const { result, DBerror } = await user.createUser(value);

  if (DBerror) return next({ data: DBerror.data, status: 400 });

  res.send(result);
};
