import { UserEntity } from '../entity/user.entity';
import { RoomEntity } from '../entity/room.entity';

export interface IMessage {
  id: number,
  text: string,
  send_date: Date,
  read: boolean,
  user: UserEntity,
  room: RoomEntity
}

export interface IGetMessages {
  room_id: number
  page: number;
  perPage: number;
}
