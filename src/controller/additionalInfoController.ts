// import { NextFunction, Request, Response } from 'express';
// import { additionalInfoValidation } from '../middlewares/validation/user.validator';
// import { getUserIdFromToken } from '../services/checkToken';
// import { userRepository } from '../repository/user.repository';
// import { generateAccessToken } from '../services/jwt';
//
// export const additionalInfoController = async (req: Request, res: Response, next: NextFunction) => {
//   const { value, error: validationError } = additionalInfoValidation.validate(req.body, { abortEarly: false });
//
//   if (validationError) return next({ data: validationError, status: 400 });
//
//   const { result, error } = await getUserIdFromToken(req.headers);
//
//   if (error) return next({ data: error, status: 401 });
//
//   const { DBResult, DBError } = await userRepository.addInfoUser(value, result.id);
//
//   if (DBError) return next({ data: DBError.data, status: 500 });
//   console.log(result);
//
//   const token = generateAccessToken(result);
//
//   res.header('access-token', token);
//   res.status(DBResult.status).send(DBResult);
// };
