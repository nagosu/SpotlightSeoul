import type { ConfigService } from '@nestjs/config';
import type { DataSourceOptions } from 'typeorm';
import { Festival } from '../modules/festival/entity/festival.entity';
import { FestivalUserBookmark } from '../modules/festival/entity/festival-user-bookmark.entity';
import { FestivalUserLike } from '../modules/festival/entity/festival-user-like.entity';
import { User } from '../modules/user/entity/user.entity';

export function createTypeOrmOptions(config: ConfigService): DataSourceOptions {
  return {
    type: 'mysql',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: Number(config.get<string>('DB_PORT', '3306')),
    username: config.get<string>('DB_USERNAME', 'root'),
    password: config.get<string>('DB_PASSWORD', 'pass'),
    database: config.get<string>('DB_SCHEMA', 'seoul'),
    // mysql2 드라이버는 connection "charset"을 collation 명칭으로 해석한다.
    // (예: utf8mb4_unicode_ci). 잘못되면 latin1로 붙어서 한글이 깨질 수 있음.
    charset: 'utf8mb4_unicode_ci',
    timezone: '+09:00',
    // Repository를 외부로 노출시키지 않기 위해 forFeature()를 쓰지 않는 구조이므로
    // 엔티티는 명시 배열로 등록한다.
    entities: [Festival, FestivalUserLike, FestivalUserBookmark, User],
    // 개발 단계에서는 허용. 운영에서는 migration 사용 권장(synchronize=false)
    synchronize: true,
    logging: ['error'],
  };
}

