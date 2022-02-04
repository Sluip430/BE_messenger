import {
  Entity, Column, PrimaryGeneratedColumn, OneToMany,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
      unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
      nullable: true,
      default: null,
    })
    first_name: string;

    @Column({
      nullable: true,
      default: null,
    })
    last_name: string;

    @Column({
      nullable: true,
      default: null,
    })
    date_of_birthday: Date;

    @Column({
      nullable: true,
      default: null,
    })
    gender: string;

    @Column({
      nullable: true,
      default: null,
    })
    confirmation_send_at: Date;

    @Column({
      nullable: true,
      default: null,
    })
    activated_at: Date;

    @OneToMany(() => SessionEntity, (session) => session.id)
     session: SessionEntity[];
}
