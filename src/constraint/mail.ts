import { EmailSubjectEnum, EmailTextEnum } from '../enum/mail.enum';
import { TMail } from '../Interface/mail.interface';

export const mail = {
  path: 'http://localhost:3004/api/mail-change-password?token=',
  emailFrom: 'olga.cigulova1991@gmail.com',
};

export const messageConf: TMail = {
  email: '',
  token: '',
  subject: EmailSubjectEnum.CONF_EMAIL,
  text: EmailTextEnum.CONF_EMAIL,
};

export const messageForgot: TMail = {
    email: '',
    token: '',
    subject: EmailSubjectEnum.CONF_EMAIL,
    text: EmailTextEnum.CONF_EMAIL,
};
