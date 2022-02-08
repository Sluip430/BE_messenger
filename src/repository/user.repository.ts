import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import axios from 'axios';
import { UserEntity } from '../entity/user.entity';
import {
  IResult, IReturnError, IReturnResult, IReturnUserEntity,
} from '../Interface/return.interface';
import { IUser } from '../Interface/user.interface';

export class UserRepository {
  typeORMRepository: Repository<UserEntity>;
  constructor() {}

  async createUser(value: IUser): Promise<IResult<UserEntity, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      value.confirmation_send_at = moment().toDate();
      const user = this.typeORMRepository.create(value);

      const result = await this.typeORMRepository.save(user);

      return { result };
    } catch (error) {
      return error;
    }
  }
  async addInfoUser(value: IUser, id: number): Promise<IResult<IReturnUserEntity, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      const result = await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        first_name: value.first_name,
        last_name: value.last_name,
        date_of_birthday: value.date_of_birthday,
        gender: value.gender,
        activated_at: moment(),
        session: [{ expired_at: moment() }],
      })
        .where('id = :id', { id })
        .returning('session')
        .execute();

      return { result: result.raw };
    } catch (error) {
      return { error };
    }
  }
  async getUserByEmail(email: string): Promise<IResult<UserEntity, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      const result = await this.typeORMRepository.findOne({ where: { email } });

      return { result };
    } catch (error) {
      return { error };
    }
  }
  async generateUserSession(user: UserEntity): Promise<IResult<IReturnResult, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        session: [{ expired_at: moment().toDate() }],
      })
        .where(user);

      return { result: { data: 'Session generate', status: 200 } };
    } catch (error) {
      return { error: { data: error.message, status: error.status } };
    }
  }
  async updateUserPassword(user: UserEntity, newPassword: string): Promise<IResult<string, IReturnError>> {
    try {
      const { id } = user;

      this.typeORMRepository = getRepository(UserEntity);
      await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        password: newPassword,
      })
        .where('id = :id', { id })
        .execute();

      return { result: 'Update Successful' };
    } catch (error) {
      return { error };
    }
  }
}

export const userRepository = new UserRepository();
