import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
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

    @Column({
      type: 'jsonb',
      array: false,
      default: () => "'[]'",
      nullable: false,
    })
    public session: Array<{ session_id: number, expired_at: Date }> = [];
}
