import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import { IResult } from '../../Interface/return.interface';
import { TMail } from '../../Interface/mail.interface';
import { mail } from '../../constraint/mail';
import { IError } from '../../Interface/Error';

dotenv.config();

const { API_KEY } = process.env;

export class SendMail {
  public API_KEY: string;
  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
    sendGrid.setApiKey(this.API_KEY);
  }
  async writeMail({
    email, token, subject, text, path,
  }: TMail): Promise<IResult<string, IError>> {
    try {
      await sendGrid.send({
        to: email,
        from: mail.emailFrom,
        subject,
        text,
        html: `<h1>${text}${path}${token}</h1>`,
      });

      return { result: `${text}${path}${token}` };
    } catch (error) {
      return { error };
    }
  }
}

export const sendMail = new SendMail(API_KEY);
