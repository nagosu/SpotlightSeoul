import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTimeEntity } from '../../../global/entity/base-time.entity';

@Index('UQ_festival_user_bookmark', ['userId', 'festivalId'], { unique: true })
@Index('IDX_festival_user_bookmark_user_id', ['userId'])
@Index('IDX_festival_user_bookmark_festival_id', ['festivalId'])
@Entity({ name: 'festival_user_bookmark' })
export class FestivalUserBookmark extends BaseTimeEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'bigint', nullable: false })
  userId: string;

  @Column({ name: 'festival_id', type: 'bigint', nullable: false })
  festivalId: string;
}

