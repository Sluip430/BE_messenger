import dotenv from 'dotenv';
import moment from 'moment';
import {
  IQuery, IResult, IReturnError, IReturnResult, IReturnResultWithToken,
} from '../../Interface/return.interface';
import { IUser } from '../../Interface/user.interface';
import { userRepository } from '../../repository/user.repository';
import { comparePassword, hashPassword } from '../../bcrypt/bcryptPassword';
import { decodeToken, generateToken } from '../jwt';
import { sendMail } from '../../helpers/sendGrid/sendMail';
import { EmailSubjectEnum, EmailTextEnum } from '../../enum/mail.enum';

dotenv.config();

const { JWT_MAIL_KEY } = process.env;
const { JWT_ACCESS_KEY } = process.env;
const { JWT_CONFIRMATION_KEY } = process.env;

export class AuthorizationServices {
  async signIn(value: IUser): Promise<IResult<IReturnResultWithToken, IReturnError>> {
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const isActivated = Boolean(DBResult.activated_at);
    const isCorrect = await comparePassword(value.password, DBResult.password);

    if (!isCorrect) {
      return { error: { data: 'Login or password is wrong', status: 401 } };
    }

    if (!isActivated) {
      return { error: { data: 'Please verify your account ', status: 401 } };
    }

    const token = generateToken(DBResult, JWT_ACCESS_KEY);
    const { error } = await userRepository.generateUserSession(DBResult);

    if (error) return { error };

    return { result: { data: 'Successful Enter!', status: 200, token } };
  }

  async forgotPassword(value: IUser): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const token = generateToken(DBResult, JWT_MAIL_KEY);

    const { result, error } = await sendMail.writeMail({
      email: DBResult.email,
      token,
      subject: EmailSubjectEnum.FORGOT_PASS_EMAIL,
      text: EmailTextEnum.FORGOT_PASS_EMAIL,
    });

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }

  async mailChangePassword(value: IQuery): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(value.token, JWT_MAIL_KEY);

    if (tokenError) return { error: tokenError };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.data.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const result = generateToken(DBResult, JWT_CONFIRMATION_KEY);

    return { result: { data: result, status: 200 } };
  }

  async changePassword(value: IUser, token: string): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(token, JWT_CONFIRMATION_KEY);

    if (tokenError) return { error: tokenError };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.data.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const newPassword = await hashPassword(value.password);
    const { result, error } = await userRepository.updateUserPassword(DBResult, newPassword);

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }

  async signUp(value: IUser): Promise<IResult<string, IReturnError>> {
    value.password = await hashPassword(value.password);

    const { result: DBResult, error: DBError } = await userRepository.createUser(value);

    if (DBError) return { error: DBError };
    const token = generateToken(DBResult, JWT_MAIL_KEY);
    const { result: MailerResult, error: MailerError } = await sendMail.writeMail({
      email: DBResult.email,
      token,
      text: EmailTextEnum.CONF_EMAIL,
      subject: EmailSubjectEnum.CONF_EMAIL,
    });

    if (MailerError) return { error: { data: MailerError.data, status: MailerError.status } };

    return { result: MailerResult };
  }

  async confirmEmail(value: IQuery): Promise<boolean> {
    const { result, error } = decodeToken(value.token, JWT_MAIL_KEY);

    if (error) return false;
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(result.data.email);

    if (DBError) return false;
    if (!DBResult) return false;
    const time = moment().toDate();

    if (Number(time) > (Number(DBResult.confirmation_send_at) + 3 * 3600 * 1000)) return false;

    return true;
  }

  async additionalInfo(value: IUser, token: string | string[]): Promise<IResult<IReturnResultWithToken, IReturnError>> {
    const { result, error } = await decodeToken(token as string, JWT_MAIL_KEY);

    if (error) return { error };

    const { error: DBError } = await userRepository.addInfoUser(value, result.data.id);

    if (DBError) return { error: DBError };

    const newToken = generateToken(result.data, JWT_ACCESS_KEY);

    return { result: { data: 'Information add', status: 201, token: newToken } };
  }
}

export const authorizationServices = new AuthorizationServices();
