import { Router } from 'express';
import { signUpController } from '../controller/signUpController';
import { confirmEmailController } from '../controller/confirmEmailController';
import { additionalInfoController } from '../controller/additionalInfoController';
import { path } from '../constraint/const';
import { authorizationController } from '../controller/controller';

export const router = Router();

router.post(path.signUp, signUpController);
router.get(path.confirmEmail, confirmEmailController);
router.post(path.acceptInvitation, additionalInfoController);
router.post(path.signIn, authorizationController.signIn);
