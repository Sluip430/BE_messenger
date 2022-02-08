import dotenv from 'dotenv';
import moment from 'moment';
import {
  IQuery,
  IResult, IReturnError, IReturnResult, IReturnResultWithToken, IUser,
} from '../../Interface/return.interface';
import { userRepository } from '../../repository/user.repository';
import { comparePassword, hashPassword } from '../../bcrypt/bcryptPassword';
import {
  decodeToken, generateToken,
} from '../jwt';
import { forgotPasswordMail, sendMMail } from '../../helpers/sendGrid/sendMail';

dotenv.config();

const { JWT_MAIL_KEY } = process.env;
const { JWT_ACCESS_KEY } = process.env;
const { JWT_CONFIRMATION_KEY } = process.env;

export class AuthorizationServices {
  async signIn(value: IUser): Promise<IResult<IReturnResultWithToken, IReturnError>> {
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };

    const isActivated = Boolean(DBResult.data.activated_at);
    const isCorrect = await comparePassword(value.password, DBResult.data.password);

    if (!isCorrect) {
      return { error: { data: 'Login or password is wrong', status: 401 } };
    }

    if (!isActivated) {
      return { error: { data: 'Please verify your account ', status: 401 } };
    }

    const token = generateToken(DBResult.data, JWT_ACCESS_KEY);
    const { error } = await userRepository.generateUserSession(DBResult.data);

    if (error) return { error: { data: error.data, status: error.status } };

    return { result: { data: 'Successful Enter!', status: 200, token } };
  }

  async forgotPassword(value: IUser): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };

    if (!DBResult.data) {
      return { error: { data: 'Sorry we dont have account with this email', status: 404 } };
    }

    const token = generateToken(DBResult.data, JWT_MAIL_KEY);
    const { result, error } = await forgotPasswordMail(DBResult.data, token);

    if (error) return { error: { data: error.data, status: error.status } };

    return { result: { data: result.data, status: 200 } };
  }

  async mailChangePassword(value: IQuery): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(value.token, JWT_MAIL_KEY);

    if (tokenError) return { error: { data: tokenError.data, status: tokenError.status } };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.data.email);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };

    const result = generateToken(DBResult.data, JWT_CONFIRMATION_KEY);

    return { result: { data: result, status: 200 } };
  }

  async changePassword(value: IUser, token: string): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(token, JWT_CONFIRMATION_KEY);

    if (tokenError) return { error: { data: tokenError.data, status: tokenError.status } };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.data.email);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };

    const newPassword = await hashPassword(value.password);
    const { result, error } = await userRepository.updateUserPassword(DBResult.data, newPassword);

    if (error) return { error: { data: error.data, status: error.status } };

    return { result: { data: result.data, status: result.status } };
  }

  async signUp(value: IUser): Promise<IResult<IReturnResult, IReturnError>> {
    value.password = await hashPassword(value.password);

    const { result: DBResult, error: DBError } = await userRepository.createUser(value);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };
    const token = generateToken(DBResult.data, JWT_MAIL_KEY);
    const { result: MailerResult, error: MailerError } = await sendMMail(DBResult.data, token);

    if (MailerError) return { error: { data: MailerError.data, status: MailerError.status } };

    return { result: { data: MailerResult.data, status: MailerResult.status } };
  }

  async confirmEmail(value: IQuery): Promise<boolean> {
    const { result, error } = decodeToken(value.token, JWT_MAIL_KEY);

    if (error) return false;
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(result.data.email);

    if (DBError) return false;
    const time = moment().toDate();

    if (Number(time) > (Number(DBResult.data.confirmation_send_at) + 3 * 3600 * 1000)) {
      return false;
    }

    if (!result) return false;

    return true;
  }

  async additionalInfo(value: IUser, token: string | string[]): Promise<IResult<IReturnResultWithToken, IReturnError>> {
    const { result, error } = await decodeToken(token as string, JWT_MAIL_KEY);

    if (error) return { error: { data: error.data, status: error.status } };

    const { error: DBError } = await userRepository.addInfoUser(value, result.data.id);

    if (DBError) return { error: { data: DBError.data, status: DBError.status } };

    const newToken = generateToken(result.data, JWT_ACCESS_KEY);

    return { result: { data: 'Information add', status: 201, token: newToken } };
  }
}

export const authorizationServices = new AuthorizationServices();
