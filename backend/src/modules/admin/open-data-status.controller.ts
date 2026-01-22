import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { SeoulOpenDataService } from '../seoul-open-data/seoul-open-data.service';

@ApiTags('Admin')
@Controller('admin/open-data')
export class OpenDataStatusController {
  constructor(
    private readonly config: ConfigService,
    private readonly seoulOpenDataService: SeoulOpenDataService,
  ) {}

  @Get('status')
  status() {
    const enabled = (this.config.get<string>('ADMIN_STATUS_ENABLED', 'false') || 'false').toLowerCase();
    if (enabled !== 'true') throw new NotFoundException('Not Found');

    const s = this.seoulOpenDataService.getStatus();
    return {
      status: 'ok',
      lastRunAt: s.lastRunAt,
      lastSuccess: s.lastSuccess,
      lastProcessedCount: s.lastProcessedCount,
      lastDurationMs: s.lastDurationMs,
      lastErrorMessage: s.lastErrorMessage,
    };
  }
}

