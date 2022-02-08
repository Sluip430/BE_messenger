import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import { IResult, IReturnError } from '../../Interface/return.interface';
import { UserEntity } from '../../entity/user.entity';
import { TMail } from '../../Interface/mail.interface';
import { mail } from '../../constraint/mail';

dotenv.config();

const { API_KEY } = process.env;

// sendGrid.setApiKey(API_KEY);

// export const sendMMail = async (data: UserEntity, token: string): Promise<IResult<string, IReturnError>> => {
//   try {
//     const { email } = data;
//
//     await sendGrid.send({
//       to: email,
//       from: 'olga.cigulova1991@gmail.com',
//       subject: 'Email Verification',
//       text: 'Hi! please confirm your email',
//       html: `<h1>Hi! please confirm your email.
//       Please visit http://localhost:3004/api/confirm-email?token=${token}</h1>`,
//     });
//
//     return {
//       result: `<h1>Hi! please confirm your email.
//       Please visit http://localhost:3004/api/confirm-email?token=${token}</h1>`,
//     };
//   } catch (error) {
//     return { error };
//   }
// };
//
// export const forgotPasswordMail = async (data: UserEntity, token: string): Promise<IResult<string, IReturnError>> => {
//   try {
//     const { email } = data;
//
//     await sendGrid.send({
//       to: email,
//       from: 'olga.cigulova1991@gmail.com',
//       subject: 'Email Verification',
//       text: 'Hi! please confirm change of password',
//       html: `<h1>Hi! please confirm change of password.
//       Please visit http://localhost:3004/api/mail-change-password?token=${token}</h1>`,
//     });
//
//     return {
//       result: `<h1>Hi! please confirm change of password.
//       Please visit http://localhost:3004/api/mail-change-password?token=${token}</h1>`,
//     };
//   } catch (error) {
//     return { error };
//   }
// };

export class SendMail {
  public API_KEY: string;
  constructor(API_KEY: string) {
    this.API_KEY = API_KEY;
  }
  async writeMail({
    email, token, subject, text,
  }: TMail): Promise<IResult<string, IReturnError>> {
    try {
      await sendGrid.send({
        to: email,
        from: mail.emailFrom,
        subject,
        text,
        html: `<h1>${text}${mail.path}${token}</h1>`,
      });

      return { result: `${text}${mail.path}${token}` };
    } catch (error) {
      return { error };
    }
  }
}

export const sendMail = new SendMail(API_KEY);
