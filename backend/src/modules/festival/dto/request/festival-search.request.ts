import { IsNotEmpty, IsString } from 'class-validator';

export class FestivalSearchRequest {
  @IsString()
  @IsNotEmpty()
  title: string;
}

