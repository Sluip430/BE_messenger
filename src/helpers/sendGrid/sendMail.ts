import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';

dotenv.config();

const { API_KEY } = process.env;

sendGrid.setApiKey(API_KEY);

export const sendMMail = async (data: any, token: number) => {
  try {
    const { email } = data;

    const result = await sendGrid.send({
      to: email,
      from: 'olga.cigulova1991@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm your email. 
      Please visit http://localhost:3004/api/confirm-email?token=${token}</h1>`,
    });
    // 'Check your Email to confirm your Email Address'

    return {
      MailerResult: {
        data: {
          to: email,
          from: 'olga.cigulova1991@gmail.com',
          subject: 'Email Verification',
          text: 'Hi! please confirm your email',
          html: `<h1>Hi! please confirm your email. 
      Please visit http://localhost:3004/api/confirm-email?token=${token}</h1>`,
        },
        status: result[0].statusCode,
      },
    };
  } catch (error) {
    return { MailerError: { data: error.message, status: 500 } };
  }
};

export const forgotPasswordMail = async (data: any, token: number) => {
  try {
    const { email } = data;
    const result = await sendGrid.send({
      to: email,
      from: 'olga.cigulova1991@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm change of password.
      Please visit http://localhost:3004/api/mail-change-password?token=${token}</h1>`,
    });
    // 'Check your Email to confirm your Email Address'

    return {
      result: {
        data: {
          to: email,
          from: 'olga.cigulova1991@gmail.com',
          subject: 'Forgot password',
          text: 'Hi! please confirm change of password',
          html: `<h1>Hi! please confirm change of password.
      Please visit http://localhost:3004/api/mail-change-password?token=${token}</h1>`,
        },
        status: result[0].statusCode,
      },
    };
  } catch (error) {
    return { error: { data: error.message, status: 500 } };
  }
};
