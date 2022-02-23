import { UserEntity } from '../entity/user.entity';
import { IUser } from './user.interface';
import { RoomEntity } from '../entity/room.entity';
import { MessageEntity } from '../entity/message.entity';

export interface IResult<TResult, TError> {
    result?: TResult;
    error?: TError;
}

export interface IReturnResult {
    data: string;
    status: number;
}

export interface IResultDataMessageArray {
    data: MessageEntity[];
    status: number;
}

export interface IReturnResultArrayAndCount {
    data: RoomEntity[];
    count: number;
}

export interface IReturnResultWithCount extends IReturnResult {
    count: number;
}

export interface IReturnIUser {
    data: IUser;
    status: number;
}

export interface IReturnError {
    data: string;
    status: number;
}

export interface IReturnResultWithToken {
    data: string;
    status: number;
    token: string;
}

export interface IReturnUserEntity{
    data: UserEntity;
    status: number;
}

export interface IQuery {
    token: string;
}
