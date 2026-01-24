import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Controller('health')
export class HealthController {
  constructor(
    private readonly dataSource: DataSource,
    private readonly config: ConfigService,
  ) {}

  @Get()
  health() {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready() {
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      throw new ServiceUnavailableException('DB 연결 실패');
    }

    const openDataEnabled =
      (this.config.get<string>('OPEN_DATA_ENABLED', 'true') || 'true').toLowerCase() === 'true';
    const schedulerEnabled =
      (this.config.get<string>('SCHEDULER_ENABLED', 'true') || 'true').toLowerCase() === 'true';

    return {
      status: 'ok',
      db: 'ok',
      openDataEnabled,
      schedulerEnabled,
    };
  }
}

