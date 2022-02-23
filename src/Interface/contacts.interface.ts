import { UserEntity } from '../entity/user.entity';

export interface IContacts {
  user: UserEntity,
  contact_user: UserEntity,
}

export interface IContactsBody {
  user_email: string
}
