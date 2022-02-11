import sendGrid from '@sendgrid/mail';
import nodemailer from 'nodemailer';
import { IResult } from '../../Interface/return.interface';
import { TMail } from '../../Interface/mail.interface';
import { mail } from '../../constraint/mail';
import { IError } from '../../Interface/Error';
import { ConfigurationService } from '../../configurations/controller.config';

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
      const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 's12122000@gmail.com', // generated ethereal user
          pass: 'tbtpdrxzbgizzfyh', // generated ethereal password
        },
      });

      await transporter.sendMail({
        to: email,
        from: mail.emailFrom,
        subject,
        text,
        html: `<h1><a href=${path}${token}>${text}</a></h1>`,
      });

      return { result: `${text}${path}${token}` };
    } catch (error) {
      return { error };
    }
  }
}

export const sendMail = new SendMail(ConfigurationService.getCustomKey('API_KEY'));
