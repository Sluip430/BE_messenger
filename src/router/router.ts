import {
  Router, Request, Response, NextFunction,
} from 'express';
import { signUpController } from '../controller/signUpController';
import { confirmEmailController } from '../controller/confirmEmailController';
import { additionalInfoController } from '../controller/additionalInfoController';

export const router = Router();

router.post('/sign-up', signUpController);
router.get('/confirm-email', confirmEmailController);
router.post('/accept-invitation', additionalInfoController);
