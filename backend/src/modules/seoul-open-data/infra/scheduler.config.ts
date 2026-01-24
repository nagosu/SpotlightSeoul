import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { SeoulOpenDataService } from '../seoul-open-data.service';

@Injectable()
export class SchedulerConfig {
  private readonly logger = new Logger(SchedulerConfig.name);

  // Spring fixedDelay=24h 유사
  @Interval(24 * 60 * 60 * 1000)
  async endFestivalScheduler() {
    const enabled = (this.config.get<string>('SCHEDULER_ENABLED', 'true') || 'true').toLowerCase();
    if (enabled !== 'true') return;

    try {
      const count = await this.seoulOpenDataService.endExpiredFestivals();
      this.logger.log(`endExpiredFestivals updated=${count}`);
    } catch (e) {
      this.logger.error(e);
    }
  }

  constructor(
    private readonly seoulOpenDataService: SeoulOpenDataService,
    private readonly config: ConfigService,
  ) {}
}

