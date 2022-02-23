import { IncomingHttpHeaders } from 'http';
import {
  IResult, IReturnError, IReturnResult, IReturnResultWithCount,
} from '../Interface/return.interface';
import { roomRepository } from '../repository/room.repository';
import { decodeToken } from './jwt';
import { ConfigurationService } from '../configurations/controller.config';
import { IError } from '../Interface/Error';
import { messageRepository } from '../repository/message.repository';
import { IRoom, IRoomParams, IUserIdIRoomId } from '../Interface/room.interface';

export class RoomServices {
  async create(value: IRoom, headers: IncomingHttpHeaders): Promise<IResult<IReturnResult, IReturnError>> {
    const { result: DBResult, error: DBError } = await roomRepository.createRoom(value);

    if (DBError) return { error: { data: DBError.message, status: 500 } };

    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token as string, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: { data: decodeError.data, status: 500 } };

    const { error } = await roomRepository.addUserToChat(DBResult.id, decodeInfo.id);

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data: 'Room Created', status: 201 } };
  }

  async addUserToChat(value: IUserIdIRoomId): Promise<IResult<IReturnResult, IError>> {
    const { result, error } = await roomRepository.addUserToChat(value.room_id, value.user_id);

    if (error) return { error };

    return { result: { data: result, status: 200 } };
  }

  async get(query: IRoomParams, headers: IncomingHttpHeaders): Promise<IResult<IReturnResultWithCount | any, IReturnError>> {
    const { result: decodeInfo, error: decodeError } = await decodeToken(headers.token as string, ConfigurationService.getCustomKey('JWT_ACCESS_KEY'));

    if (decodeError) return { error: decodeError };

    const { result, error } = await roomRepository.get(query, decodeInfo);

    const data = await Promise.all(result.data.map((item) => messageRepository.getLastMessageInRoom(item)));

    if (error) return { error: { data: error.message, status: 500 } };

    return { result: { data, count: result.count, status: 200 } };
  }
}

export const roomServices = new RoomServices();
