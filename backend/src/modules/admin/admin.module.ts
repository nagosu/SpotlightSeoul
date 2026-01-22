import { Module } from '@nestjs/common';
import { OpenDataStatusController } from './open-data-status.controller';
import { SeoulOpenDataModule } from '../seoul-open-data/seoul-open-data.module';

@Module({
  imports: [SeoulOpenDataModule],
  controllers: [OpenDataStatusController],
})
export class AdminModule {}

