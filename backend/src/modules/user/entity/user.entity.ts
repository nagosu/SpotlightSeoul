import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Entity({ name: 'users' })
export class User extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Index({ unique: true })
  @Column({ name: 'username', type: 'varchar', length: 100, nullable: false })
  username: string;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  email: string;

  // TODO: Spring 1:1(평문 비교) 유지. 운영에서는 반드시 해싱(bcrypt 등)으로 전환 필요
  @Column({ name: 'password', type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ name: 'location', type: 'varchar', length: 255, nullable: false })
  location: string;

  @Column({ name: 'is_deleted', type: 'boolean', default: false })
  isDeleted: boolean;

  @Column({
    name: 'refresh_token',
    type: 'varchar',
    length: 500,
    nullable: true,
  })
  refreshToken: string | null;
}

