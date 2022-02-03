import {
  Router, Request, Response, NextFunction,
} from 'express';
import { signUpController } from '../controller/signUpController';
import { confirmEmailController } from '../controller/confirmEmailController';

export const router = Router();

router.post('/sign-up', signUpController);
router.get('/confirm-email', confirmEmailController);
