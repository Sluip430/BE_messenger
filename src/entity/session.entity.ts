import {
  Entity, Column, PrimaryGeneratedColumn, ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class SessionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    expired_at: Date;

    @ManyToOne(() => UserEntity, (user) => user.session)
    user: UserEntity;
}
