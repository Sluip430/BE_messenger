import { EmailSubjectEnum, EmailTextEnum } from '../enum/mail.enum';

export interface TMail {
    email: string,
    token: string,
    subject: EmailSubjectEnum,
    text: EmailTextEnum,
}
