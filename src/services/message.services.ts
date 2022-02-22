import { InsertResult } from 'typeorm';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { messageRepository } from '../repository/message.repository';
import { IResult } from '../Interface/return.interface';
import { ConfigurationService } from '../configurations/controller.config';

class MessageServices {
  async create(value: any, headers): Promise<IResult<any, any>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: decodeError };

    const { result: user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (userError) return { error: userError };

    const { result, error } = await messageRepository.create(value, user);

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }
}

export const messageServices = new MessageServices();
