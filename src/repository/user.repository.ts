import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import axios from 'axios';
import { UserEntity } from '../entity/user.entity';
import {
  IResult, IReturnError, IReturnResult, IReturnUserEntity, IUser,
} from '../Interface/return.interface';

export class UserRepository {
  typeORMRepository: Repository<UserEntity>;
  constructor() {}

  async createUser(value: IUser): Promise<IResult<IReturnUserEntity, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      value.confirmation_send_at = moment().toDate();
      const user = this.typeORMRepository.create(value);
      const result = await this.typeORMRepository.save(user);

      return ({ result: { data: result[0], status: 200 } });
    } catch (err) {
      return ({ error: { data: err.message, status: 500 } });
    }
  }
  async getUserByEmailTime(value: IUser): Promise<boolean> {
    this.typeORMRepository = getRepository(UserEntity);
    const result = await this.typeORMRepository.findOne({ where: { email: value.email } });
    const time = moment().toDate();

    if (Number(time) > (Number(result.confirmation_send_at) + 3 * 3600 * 1000)) {
      return false;
    }

    if (!result) return false;

    return true;
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

      return ({ result: { data: result.raw, status: 200 } });
    } catch (err) {
      return ({ error: { data: err.message, status: 500 } });
    }
  }
  async getUserByEmail(email: string): Promise<IResult<IReturnUserEntity, IReturnError>> {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      const result = await this.typeORMRepository.findOne({ where: { email } });

      return { result: { data: result, status: 200 } };
    } catch (error) {
      return { error: { data: error.message, status: 500 } };
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
  async updateUserPassword(user: UserEntity, newPassword: string): Promise<IResult<IReturnResult, IReturnError>> {
    try {
      const { id } = user;

      this.typeORMRepository = getRepository(UserEntity);
      await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        password: newPassword,
      })
        .where('id = :id', { id })
        .execute();

      return { result: { data: 'Update Successful', status: 200 } };
    } catch (error) {
      const url = encodeURI(
        `https://api.telegram.org/bot5169347842:AAETMbYL8GwumiYYen8m2VIUSEXJYzoqYs0/sendMessage?chat_id=501736264&text=${error}`,
      );

      await axios.get(url);

      return { error };
    }
  }
}

export const userRepository = new UserRepository();
