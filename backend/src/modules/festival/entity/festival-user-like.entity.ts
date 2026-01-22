import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Index('UQ_festival_user_like', ['userId', 'festivalId'], { unique: true })
@Index('IDX_festival_user_like_festival_id', ['festivalId'])
@Index('IDX_festival_user_like_user_id', ['userId'])
@Entity({ name: 'festival_user_like' })
export class FestivalUserLike extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', nullable: false })
  userId: string;

  @Column({ name: 'festival_id', type: 'bigint', nullable: false })
  festivalId: string;
}

