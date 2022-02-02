import { getRepository, Repository } from 'typeorm';
import { User } from '../entity/user';

// export const signUp = async (data) => {
//   try {
//     const user = userRepository.create(data);
//     const result = await userRepository.save(user);
//
//     return { result };
//   } catch (error) {
//     return ({ DBerror: { data: error.message, status: 500 } });
//   }
// };

class UserRepository {
    userRepository: Repository<User>;
    constructor(User) {
      this.userRepository = getRepository(User);
      console.log('SLAVIK LOH');
    }

    async getAll(value) {
      try {
        const user = this.userRepository.create(value);
        const result = await this.userRepository.save(user);

        return { result };
      } catch (err) {
        return ({ DBerror: { data: err.message, status: 500 } });
      }
    }
}

export const userRepository = new UserRepository(User);
