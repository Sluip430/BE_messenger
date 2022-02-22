import { getRepository, Repository } from 'typeorm';
import {
  IResult, IReturnUserEntity,
} from '../Interface/return.interface';
import { IError } from '../Interface/Error';
import { RoomEntity } from '../entity/room.entity';
import { IRoom } from '../Interface/room.interface';
import { IUser } from '../Interface/user.interface';

export class RoomRepository {
    typeORMRepository: Repository<RoomEntity>;

    async createRoom(value: IRoom): Promise<IResult<RoomEntity, IError>> {
      try {
        this.typeORMRepository = getRepository(RoomEntity);
        const room = this.typeORMRepository.create(value);
        const result = await this.typeORMRepository.save(room);

        return { result };
      } catch (error) {
        return { error };
      }
    }

    async addUserToChat(roomId: any, userId: any): Promise<IResult<void, IError>> {
      try {
        const result = await this.typeORMRepository
          .createQueryBuilder('room')
          .relation(RoomEntity, 'users')
          .of(roomId)
          .add(userId);

        return { result };
      } catch (error) {
        return { error };
      }
    }

    async get(params: any, user: IUser): Promise<IResult<any, IError>> {
      try {
        this.typeORMRepository = getRepository(RoomEntity);
        const result = await this.typeORMRepository
          .createQueryBuilder('room')
          .leftJoin('room.users', 'users')
          .where(`users.id = ${user.id}`)
          .andWhere('room.name like :name', { name: `%${params.name}%` })
          .offset((params.page - 1) * params.perPage)
          .limit(params.perPage)
          .getMany();

        return { result: { data: result, count: result.length } };
      } catch (error) {
        return { error };
      }
    }
}

export const roomRepository = new RoomRepository();
