import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseTimeEntity {
  // TypeORM(MySQL)의 기본 CURRENT_TIMESTAMP(6)와 정밀도를 맞춰
  // "Invalid default value" 에러를 방지한다.
  @CreateDateColumn({ name: 'created_at', type: 'datetime', precision: 6 })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime', precision: 6 })
  updatedAt: Date;

  // soft delete는 Phase D에서 실제 삭제 API로 사용 예정(지금은 컬럼/필터만)
  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  deletedAt: Date | null;
}

