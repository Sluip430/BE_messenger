import { Router } from 'express';
import { routes } from '../constraint/routes';
import { contactsController } from '../controller/contacts.controller';

export const contactsRouter = Router();

contactsRouter
  .post(routes.DEFAULT, contactsController.create);
