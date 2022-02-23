import { IncomingHttpHeaders } from 'http';
import { decodeToken } from './jwt';
import { userRepository } from '../repository/user.repository';
import { messageRepository } from '../repository/message.repository';
import {
  IResult, IResultDataMessageArray, IReturnError, IReturnResult,
} from '../Interface/return.interface';
import { ConfigurationService } from '../configurations/controller.config';
import { IGetMessages, IMessage } from '../Interface/message.interface';
import { roomRepository } from '../repository/room.repository';

class MessageServices {
  async create(value: IMessage, headers: IncomingHttpHeaders): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token as string, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: decodeError };

    const { result: user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (userError) return { error: userError };

    const { result, error } = await messageRepository.create(value, user);

    if (error) return { error };

    global.io.emit('send message', { result });

    return { result: { data: result, status: 200 } };
  }

  async get(value: IGetMessages, headers): Promise<IResult<IResultDataMessageArray, IReturnError>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: { data: decodeError.data, status: 500 } };

    const { result: user, error: userError } = await userRepository.getUserByEmail(decodeInfo.email);

    if (!user) return { error: { data: 'Invalid token', status: 400 } };

    if (userError) return { error: { data: userError.data, status: 400 } };

    const { result: chat, error: chatError } = await roomRepository.getUserInChat(user.id, value.room_id);

    if (chatError) return { error: { data: 'Not Found', status: 404 } };

    if (!chat) return { error: { data: 'Invalid token', status: 404 } };

    const { result, error } = await messageRepository.getAllByChat(value);

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data: result, status: 200 } };
  }
}

export const messageServices = new MessageServices();
