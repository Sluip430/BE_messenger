import {
  Router, Request, Response, NextFunction,
} from 'express';
import { signUpController } from '../controller/signUpController';

export const router = Router();

router.post('/sign-up', signUpController);
