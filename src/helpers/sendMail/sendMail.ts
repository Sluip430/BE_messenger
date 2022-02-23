import nodemailer from 'nodemailer';
import { IResult } from '../../Interface/return.interface';
import { TMail } from '../../Interface/mail.interface';
import { htmlMail, mail } from '../../constraint/mail';
import { IError } from '../../Interface/Error';

export class SendMail {
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
        html: htmlMail(path, token, text),
      });

      return { result: `${text}${path}${token}` };
    } catch (error) {
      return { error };
    }
  }
}

export const sendMail = new SendMail();
