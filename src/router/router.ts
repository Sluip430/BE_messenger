import { Router } from 'express';
import { routes } from '../constraint/routes';
import { authorizationController } from '../controller/controller';

export const router = Router();

router.post(routes.SIGN_UP, authorizationController.signUp);
router.get(routes.CONFIRM_EMAIL, authorizationController.confirmEmail);
router.post(routes.ACCEPT_INVITATION, authorizationController.additionalInfo);
router.post(routes.SIGN_IN, authorizationController.signIn);
router.post(routes.FORGOT_PASSWORD, authorizationController.forgotPassword);
router.get(routes.MAIL_CHANGE_PASSWORD, authorizationController.mailChangePassword);
router.post(routes.CHANGE_PASSWORD, authorizationController.changePassword);
