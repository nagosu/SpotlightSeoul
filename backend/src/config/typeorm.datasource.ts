import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Festival } from '../modules/festival/entity/festival.entity';
import { FestivalUserBookmark } from '../modules/festival/entity/festival-user-bookmark.entity';
import { FestivalUserLike } from '../modules/festival/entity/festival-user-like.entity';
import { User } from '../modules/user/entity/user.entity';

/**
 * TypeORM CLI(Migration) 용 DataSource
 * - TODO: 운영에서는 synchronize=false + migration으로 스키마 관리 권장
 */
export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? '3306'),
  username: process.env.DB_USERNAME ?? 'root',
  password: process.env.DB_PASSWORD ?? 'pass',
  database: process.env.DB_SCHEMA ?? 'seoul',
  charset: 'utf8mb4_unicode_ci',
  timezone: '+09:00',
  entities: [Festival, FestivalUserLike, FestivalUserBookmark, User],
  migrations: [process.env.TYPEORM_MIGRATIONS ?? 'src/migrations/*{.ts,.js}'],
  // 운영 권장: migration 사용 (CLI는 항상 synchronize 끔)
  synchronize: false,
  logging: ['error'],
});

export default AppDataSource;

