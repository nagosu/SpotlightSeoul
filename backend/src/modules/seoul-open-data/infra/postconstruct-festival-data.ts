import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeoulOpenDataService } from '../seoul-open-data.service';

@Injectable()
export class PostconstructFestivalData implements OnApplicationBootstrap {
  private readonly logger = new Logger(PostconstructFestivalData.name);

  constructor(
    private readonly seoulOpenDataService: SeoulOpenDataService,
    private readonly config: ConfigService,
  ) {}

  async onApplicationBootstrap() {
    const enabled = (this.config.get<string>('OPEN_DATA_ENABLED', 'true') || 'true').toLowerCase();
    if (enabled !== 'true') {
      this.logger.log('boot: fetchAllAndSaveOnce skipped (OPEN_DATA_ENABLED=false)');
      return;
    }

    this.logger.log('boot: fetchAllAndSaveOnce start');
    try {
      await this.seoulOpenDataService.fetchAllAndSaveOnce();
      this.logger.log('boot: fetchAllAndSaveOnce done');
    } catch (e) {
      // 상태 기록용(간단)
      // - 서비스 내부에서 status를 관리하므로 여기서는 로그만 유지
      // Spring 1:1: 예외를 크게 래핑하지 않고 그대로 로그만 남김
      this.logger.error(e);
    }
  }
}

