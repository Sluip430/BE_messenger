import { Router } from 'express';
import { path } from '../constraint/const';
import { authorizationController } from '../controller/controller';

export const router = Router();

router.post(path.signUp, authorizationController.signUp);
router.get(path.confirmEmail, authorizationController.confirmEmail);
router.post(path.acceptInvitation, authorizationController.additionalInfo);
router.post(path.signIn, authorizationController.signIn);
router.post(path.forgotPassword, authorizationController.forgotPassword);
router.get(path.mailChangePassword, authorizationController.mailChangePassword);
router.post(path.changePassword, authorizationController.changePassword);
