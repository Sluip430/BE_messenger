import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import { MessageEntity } from '../entity/message.entity';
import { UserEntity } from '../entity/user.entity';
import { IResult } from '../Interface/return.interface';
import { RoomEntity } from '../entity/room.entity';
import { IError } from '../Interface/Error';
import { IGetMessages } from '../Interface/message.interface';

export class MessageRepository {
  typeORMRepository: Repository<MessageEntity>;

  async create(value: any, user: UserEntity): Promise<IResult<any, any>> {
    try {
      this.typeORMRepository = getRepository(MessageEntity);
      const message = {
        text: value.text,
        read: false,
        send_date: moment().toDate(),
        user,
        room: value.room_id,
      };

      await this.typeORMRepository.createQueryBuilder('message')
        .insert()
        .into(MessageEntity)
        .values([message,
        ])
        .execute();

      return { result: message };
    } catch (error) {
      return { error };
    }
  }

  async getLastMessageInRoom(room: RoomEntity): Promise<IResult<MessageEntity | RoomEntity, IError>> {
    try {
      this.typeORMRepository = getRepository(MessageEntity);
      const result = await this.typeORMRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.room', 'room')
        .where(`room.id = ${room.id}`)
        .orderBy('message.send_date', 'DESC')
        .getMany();

      if (!result[0]) {
        return { result: room };
      }

      return { result: result[0] };
    } catch (error) {
      return { error };
    }
  }

  async getAllByChat(value: IGetMessages): Promise<IResult<MessageEntity[], Error>> {
    try {
      this.typeORMRepository = getRepository(MessageEntity);

      const result = await this.typeORMRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.user', 'user')
        .leftJoinAndSelect('message.room', 'room')
        .where(`room.id = ${value.room_id}`)
        .offset((value.page - 1) * value.perPage)
        .limit(value.perPage)
        .orderBy('message.send_date', 'ASC')
        .getMany();

      return { result };
    } catch (error) {
      return { error };
    }
  }
}

export const messageRepository = new MessageRepository();
