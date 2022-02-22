import { UserEntity } from '../entity/user.entity';

export interface IRoom {
    id: number;
    name: string;
    users: UserEntity[]
}
