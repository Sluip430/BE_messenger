import { UserEntity } from '../entity/user.entity';
import { IUser } from './user.interface';

export interface IRoom {
    id: number;
    name: string;
    users: UserEntity[]
}

export interface IUserIdIRoomId extends IRoom, IUser{
    user_id: number;
    room_id: number;
}

export interface IRoomParams {
    name: string;
    users: UserEntity[];
    page?: number;
    perPage?: number;
}
