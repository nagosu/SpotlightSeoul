import { ApiProperty } from '@nestjs/swagger';
import { FestivalResponse } from './festival-response';

export class FestivalNearResponse extends FestivalResponse {
  @ApiProperty({ name: 'distance_km', example: 1.23 })
  distanceKm: number;
}

