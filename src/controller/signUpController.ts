import { Request, Response, NextFunction } from 'express';
import { signUpValidation } from '../middlewares/validation/user.validator';
import { user } from '../repository/user.repository';
import { geterateToken } from '../services/jwt';
import { sendMMail } from '../helpers/sendGrid/sendMail';
import { hashPassword } from '../bcrypt/bcryptPassword';

export const signUpController = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = signUpValidation.validate(req.body, { abortEarly: false });

  if (error) return next({ data: error.details[0].message, status: 400 });
  value.password = await hashPassword(value.password);

  const { DBResult, DBError } = await user.createUser(value);

  if (DBError) return next({ data: DBError.data, status: 400 });

  const token = geterateToken(DBResult.data);
  const { MailerResult, MailerError } = await sendMMail(DBResult.data, token);

  if (MailerError) return next({ data: MailerError.data, status: MailerError.status });

  res.status(MailerResult.status).send(MailerResult);
};
