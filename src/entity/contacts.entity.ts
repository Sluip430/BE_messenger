import {
  Entity, PrimaryGeneratedColumn, ManyToOne, Column,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IContacts } from '../Interface/contacts.interface';

@Entity()
export class ContactsEntity implements IContacts {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.id)
  contact_user: UserEntity;
}
