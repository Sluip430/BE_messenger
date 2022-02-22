import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoomEntity } from './room.entity';
import { IMessage } from '../Interface/message.interface';

@Entity()
export class MessageEntity implements IMessage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
  })
  text: string;

  @Column({
    type: 'boolean',
  })
  read: boolean;

  @Column({
    default: null,
    type: 'timestamptz',
  })
  send_date: Date;

  @ManyToOne(() => UserEntity, (user) => user.id)
  user: UserEntity;

  @ManyToOne(() => RoomEntity, (room) => room.id)
  room: RoomEntity;
}
