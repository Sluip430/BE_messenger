import { UserEntity } from '../entity/user.entity';
import { IUser } from './user.interface';

export interface IResult<TResult, TError> {
    result?: TResult;
    error?: TError;
}

export interface IReturnResult {
    data: string;
    status: number;
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
