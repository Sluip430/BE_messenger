import { IResult, IReturnError, IReturnResult } from '../Interface/return.interface';
import { roomRepository } from '../repository/room.repository';
import { decodeToken } from './jwt';
import { ConfigurationService } from '../configurations/controller.config';
import { IError } from '../Interface/Error';
import { messageRepository } from '../repository/message.repository';

export class RoomServices {
  async create(value: any, headers): Promise<IResult<IReturnResult, any>> {
    const { result: DBResult, error: DBError } = await roomRepository.createRoom(value);

    if (DBError) return { error: { data: DBError.message, status: 500 } };

    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    const { result, error } = await roomRepository.addUserToChat(DBResult.id, decodeInfo.id);

    return { result: { data: 'Room Created', status: 201 } };
  }

  async addUserToChat(value: any): Promise<IResult<any, IError>> {
    const { result, error } = await roomRepository.addUserToChat(value.room_id, value.user_id);

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }

  async get(params: any, headers): Promise<IResult<any, any>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: decodeError };

    const { result, error } = await roomRepository.get(params, decodeInfo);

    const data = await Promise.all(result.data.map(async (item) => await messageRepository.getLastMessageInRoom(item)));

    if (error) return { error };

    return { result: { data, count: result.count, status: 200 } };
  }
}

export const roomServices = new RoomServices();
