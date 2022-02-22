import { getRepository, InsertResult, Repository } from 'typeorm';
import moment from 'moment';
import { MessageEntity } from '../entity/message.entity';
import { UserEntity } from '../entity/user.entity';
import { IResult } from '../Interface/return.interface';
import { IRoom } from '../Interface/room.interface';

export class MessageRepository {
  typeORMRepository: Repository<MessageEntity>;

  async create(value: any, user: UserEntity): Promise<IResult<any, any>> {
    try {
      this.typeORMRepository = getRepository(MessageEntity);
      const result = await this.typeORMRepository.createQueryBuilder('message')
        .insert()
        .into(MessageEntity)
        .values([
          {
            text: value.text,
            read: false,
            send_date: moment().toDate(),
            user,
            room: value.room_id,
          },
        ])
        .execute();

      return { result };
    } catch (error) {
      return { error };
    }
  }

  async getLastMessageInRoom(room: IRoom): Promise<any> {
    try {
      this.typeORMRepository = getRepository(MessageEntity);
      const result = await this.typeORMRepository
        .createQueryBuilder('message')
        .leftJoinAndSelect('message.room', 'room')
        .where(`room.id = ${room.id}`)
        .orderBy('message.send_date', 'DESC')
        .getMany();

      if (!result[0]) {
        return { room };
      }

      return result[0];
    } catch (error) {
      return { error };
    }
  }
}

export const messageRepository = new MessageRepository();
