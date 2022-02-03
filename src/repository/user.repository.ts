import { getRepository, Repository } from 'typeorm';
import moment from 'moment';
import { User } from '../entity/user';

export class UserRepository {
  typeORMRepository: Repository<User>;
  constructor() {}

  async createUser(value) {
    try {
      this.typeORMRepository = getRepository(User);
      const user = this.typeORMRepository.create(value);
      const result = await this.typeORMRepository.save(user);

      return ({ DBResult: { data: result, status: 200 } });
    } catch (err) {
      return ({ DBError: { data: err.message, status: 500 } });
    }
  }
  async getUserByEmail(value) {
    try {
      this.typeORMRepository = getRepository(User);
      const result = await this.typeORMRepository.findOne({ where: { email: value.email } });

      return ({ DBResult: { data: result, status: 200 } });
    } catch (err) {
      return ({ DBError: { data: err.message, status: 500 } });
    }
  }
  async addInfoUser(value, id) {
    try {
      this.typeORMRepository = getRepository(User);
      const result = await this.typeORMRepository.createQueryBuilder().update(User).set({
        first_name: value.first_name,
        last_name: value.last_name,
        date_of_birthday: value.date_of_birthday,
        gender: value.gender,
      })
        .where('id = :id', { id })
        .execute();

      return ({ DBResult: { data: result, status: 200 } });
    } catch (err) {
      return ({ DBError: { data: err.message, status: 500 } });
    }
  }
}

export const user = new UserRepository();
