import { getRepository, Repository } from 'typeorm';
import { IResult } from '../Interface/return.interface';
import { ContactsEntity } from '../entity/contacts.entity';
import { IError } from '../Interface/Error';
import { UserEntity } from '../entity/user.entity';

export class ContactsRepository {
  typeORMRepository: Repository<ContactsEntity>;

  async createByBothEntity(user: UserEntity, contact_user: UserEntity): Promise<IResult<any, IError>> {
    try {
      this.typeORMRepository = getRepository(ContactsEntity);
      const result = await this.typeORMRepository
        .createQueryBuilder()
        .insert()
        .into(ContactsEntity)
        .values([
          {
            user,
            contact_user,
          },
        ])
        .execute();

      return { result };
    } catch (error) {
      return { error };
    }
  }
}

export const contactsRepository = new ContactsRepository();
