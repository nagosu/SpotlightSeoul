import { Module } from '@nestjs/common';
import { SeoulOpenDataClient } from './seoul-open-data.client';
import { SeoulOpenDataService } from './seoul-open-data.service';
import { PostconstructFestivalData } from './infra/postconstruct-festival-data';
import { SchedulerConfig } from './infra/scheduler.config';
import { FestivalModule } from '../festival/festival.module';

@Module({
  imports: [
    // FestivalRepository(기본필터 qb) 재사용을 위해 import
    FestivalModule,
  ],
  providers: [
    SeoulOpenDataClient,
    SeoulOpenDataService,
    PostconstructFestivalData,
    SchedulerConfig,
  ],
  exports: [SeoulOpenDataService],
})
export class SeoulOpenDataModule {}

