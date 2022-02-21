import moment from 'moment';
import {
  IQuery, IResult, IReturnError, IReturnResult, IReturnResultWithToken,
} from '../../Interface/return.interface';
import { IUser } from '../../Interface/user.interface';
import { userRepository } from '../../repository/user.repository';
import { comparePassword, hashPassword } from '../../helpers/bcrypt/bcryptPassword';
import { decodeToken, generateToken } from '../jwt';
import { sendMail } from '../../helpers/sendMail/sendMail';
import { EmailSubjectEnum, EmailTextEnum } from '../../enum/mail.enum';
import { mail } from '../../constraint/mail';
import { ConfigurationService } from '../../configurations/controller.config';

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

    const token = generateToken(DBResult, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));
    const { error } = await userRepository.generateUserSession(DBResult);

    if (error) return { error };

    return { result: { data: 'Successful Enter!', status: 200, token } };
  }

  async forgotPassword(value: IUser): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(value.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const token = generateToken(DBResult, ConfigurationService.getCustomKey('JWT_MAIL_KEY'));

    const { result, error } = await sendMail.writeMail({
      email: DBResult.email,
      token,
      subject: EmailSubjectEnum.FORGOT_PASS_EMAIL,
      text: EmailTextEnum.FORGOT_PASS_EMAIL,
      path: mail.PATH_FORGOT_PASS,
    });

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data: result, status: 200 } };
  }

  async mailChangePassword(value: IQuery): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(value.token, ConfigurationService.getCustomKey('JWT_MAIL_KEY'));

    if (tokenError) return { error: tokenError };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const result = generateToken(DBResult, ConfigurationService.getCustomKey('JWT_CONFIRMATION_KEY'));

    return { result: { data: result, status: 200 } };
  }

  async changePassword(value: IUser, token: string): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: data, error: tokenError } = decodeToken(token, ConfigurationService.getCustomKey('JWT_CONFIRMATION_KEY'));

    if (tokenError) return { error: tokenError };

    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(data.email);

    if (DBError) return { error: DBError };
    if (!DBResult) return { error: { data: 'Not Found', status: 404 } };

    const newPassword = await hashPassword(value.password);
    const { result, error } = await userRepository.updateUserPassword(DBResult, newPassword);

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }

  async signUp(value: IUser): Promise<IResult<IReturnResult, IReturnError>> {
    value.password = await hashPassword(value.password);

    const { result: DBResult, error: DBError } = await userRepository.createUser(value);

    if (DBError) return { error: { data: DBError.message, status: 500 } };
    const token = generateToken(DBResult.data, ConfigurationService.getCustomKey('JWT_MAIL_KEY'));
    const { result: MailerResult, error: MailerError } = await sendMail.writeMail({
      email: DBResult.data.email,
      token,
      text: EmailTextEnum.CONF_EMAIL,
      subject: EmailSubjectEnum.CONF_EMAIL,
      path: mail.PATH_CONF,
    });

    if (MailerError) return { error: { data: MailerError.message, status: 500 } };

    return { result: { data: MailerResult, status: 201 } };
  }

  async confirmEmail(value: IQuery): Promise<boolean> {
    const { result, error } = decodeToken(value.token, ConfigurationService.getCustomKey('JWT_MAIL_KEY'));

    if (error) return false;
    const { result: DBResult, error: DBError } = await userRepository.getUserByEmail(result.email);

    if (DBError) return false;
    if (!DBResult) return false;
    const time = moment().toDate();

    if (Number(time) > (Number(DBResult.confirmation_send_at) + 3 * 3600 * 1000)) return false;

    return true;
  }

  async additionalInfo(value: IUser, token: string | string[]): Promise<IResult<IReturnResultWithToken, IReturnError>> {
    const { result, error } = await decodeToken(token as string, ConfigurationService.getCustomKey('JWT_MAIL_KEY'));

    if (error) return { error };

    const { error: DBError } = await userRepository.addInfoUser(value, result.id);

    if (DBError) return { error: DBError };

    const newToken = generateToken(result, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    return { result: { data: 'Information add', status: 201, token: newToken } };
  }
}

export const authorizationServices = new AuthorizationServices();
