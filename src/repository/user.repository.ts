import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import { UserEntity } from '../entity/user.entity';

export class UserRepository {
  typeORMRepository: Repository<UserEntity>;
  constructor() {}

  async createUser(value) {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      value.confirmation_send_at = moment();
      const user = this.typeORMRepository.create(value);
      const result = await this.typeORMRepository.save(user);

      return ({ DBResult: { data: result, status: 200 } });
    } catch (err) {
      return ({ DBError: { data: err.message, status: 500 } });
    }
  }
  async getUserByEmailTime(value) {
    this.typeORMRepository = getRepository(UserEntity);
    const result = await this.typeORMRepository.findOne({ where: { email: value.email } });
    const time = moment().toDate();

    if (Number(time) > (Number(result.confirmation_send_at) + 3 * 3600 * 1000)) {
      return false;
    }

    if (!result) return false;

    return true;
  }
  async addInfoUser(value, id) {
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

      return ({ DBResult: { data: result.raw, status: 200 } });
    } catch (err) {
      return ({ DBError: { data: err.message, status: 500 } });
    }
  }
  async getUserByEmail(email) {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      const result = await this.typeORMRepository.findOne({ where: { email } });

      return { result: { data: result, status: 200 } };
    } catch (error) {
      return { error: { data: error.message, status: 500 } };
    }
  }
  async generateUserSession(user) {
    try {
      this.typeORMRepository = getRepository(UserEntity);
      const result = await this.typeORMRepository.createQueryBuilder().update(UserEntity).set({
        session: [{ expired_at: moment().toDate() }],
      })
        .where(user);

      return { result };
    } catch (error) {
      return { error };
    }
  }
}

export const userRepository = new UserRepository();
