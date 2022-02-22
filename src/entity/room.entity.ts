import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { IRoom } from '../Interface/room.interface';

@Entity()
export class RoomEntity implements IRoom {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      type: 'text',
    })
    name: string;

    @ManyToMany(() => UserEntity)
    @JoinTable()
    users: UserEntity[];
}
