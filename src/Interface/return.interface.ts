import { UserEntity } from '../entity/user.entity';

export interface IResult<T, T2> {
    result?: T,
    error?: T2
}

export interface IReturnResult {
    data: string,
    status: number
}

export interface IReturnIUser {
    data: IUser,
    status: number
}

export interface IReturnError {
    data: string,
    status: number
}

export interface IReturnResultWithToken {
    data: string,
    status: number,
    token: string
}

export interface IReturnUserEntity{
    data: UserEntity,
    status: number
}

export interface IUser {
    id: number,
    email: string,
    password: string,
    first_name: string,
    last_name: string,
    date_of_birthday: Date,
    gender: string,
    confirmation_send_at: Date,
    activated_at: Date,
    session: { session_id: number, expired_at: Date }[];
}

export interface IQuery {
    token: string
}
