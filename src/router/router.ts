import { Router } from 'express';
// import { confirmEmailController } from '../controller/confirmEmailController';
// import { additionalInfoController } from '../controller/additionalInfoController';
import { path } from '../constraint/const';
import { authorizationController } from '../controller/controller';

export const router = Router();

router.post(path.signUp, authorizationController.signUpController);
router.get(path.confirmEmail, authorizationController.confirmEmailController);
router.post(path.acceptInvitation, authorizationController.additionalInfoController);
router.post(path.signIn, authorizationController.signIn);
router.post(path.forgotPassword, authorizationController.forgotPassword);
router.get(path.mailChangePassword, authorizationController.mailChangePassword);
router.post(path.changePassword, authorizationController.changePassword);
