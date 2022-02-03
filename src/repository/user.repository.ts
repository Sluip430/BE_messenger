import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/user';

export class UserRepository {
  typeORMRepository: Repository<User>;
  constructor(User) {
    this.typeORMRepository = getRepository(User);
  }

  async createUser(value) {
    try {
      const user = this.typeORMRepository.create(value);
      const result = await this.typeORMRepository.save(user);

      return { result };
    } catch (err) {
      return ({ DBerror: { data: err.message, status: 500 } });
    }
  }
}


