import { NextFunction, Request, Response } from 'express';
import { additionalInfoValidation } from '../middlewares/validation/user.validator';
import { checkValidToken, getUserIdFromToken } from '../services/checkToken';
import { user } from '../repository/user.repository';

export const additionalInfoController = async (req: Request, res: Response, next: NextFunction) => {
  const { value, error } = additionalInfoValidation.validate(req.body, { abortEarly: false });

  if (error) return next({ data: error, status: 400 });

  const { result, TokenError } = await getUserIdFromToken(req.headers);

  console.log(result);
  const { DBResult, DBError } = await user.addInfoUser(value, result.id);

  if (DBError) return next({ data: DBError.data, status: 500 });

  // const token = geterateToken(DBResult.data);
  // const { MailerResult, MailerError } = await sendMMail(DBResult.data, token);
  //
  // if (MailerError) return next({ data: MailerError.data, status: MailerError.status });
  //
  res.status(DBResult.status).send(DBResult);
};
