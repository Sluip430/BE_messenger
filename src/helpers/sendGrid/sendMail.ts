import dotenv from 'dotenv';
import sendGrid from '@sendgrid/mail';
import axios from 'axios';
import {
  IResult, IReturnError, IReturnResult,
} from '../../Interface/return.interface';
import { UserEntity } from '../../entity/user.entity';

dotenv.config();

const { API_KEY } = process.env;

sendGrid.setApiKey(API_KEY);

export const sendMMail = async (data: UserEntity, token: number): Promise<IResult<IReturnResult, IReturnError>> => {
  try {
    const { email } = data;

    await sendGrid.send({
      to: email,
      from: 'olga.cigulova1991@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm your email. 
      Please visit http://localhost:3004/api/confirm-email?token=${token}</h1>`,
    });
    // 'Check your Email to confirm your Email Address'

    return { result: { data: 'Mail send', status: 200 } };
  } catch (error) {
    return { error: { data: error.message, status: 500 } };
  }
};

export const forgotPasswordMail = async (data: UserEntity, token: string): Promise<IResult<IReturnResult, IReturnError>> => {
  try {
    const { email } = data;

    await sendGrid.send({
      to: email,
      from: 'olg1a1.cigulova1991@gmail.com',
      subject: 'Email Verification',
      text: 'Hi! please confirm your email',
      html: `<h1>Hi! please confirm change of password.
      Please visit http://localhost:3004/api/mail-change-password?token=${token}</h1>`,
    });
    // 'Check your Email to confirm your Email Address'

    return { result: { data: 'Mail send', status: 200 } };
  } catch (error) {
    const url = encodeURI(
      `https://api.telegram.org/bot5169347842:AAETMbYL8GwumiYYen8m2VIUSEXJYzoqYs0/sendMessage?chat_id=501736264&text=${error}`,
    );

    await axios.get(url);

    return { error: { data: error.message, status: 500 } };
  }
};
