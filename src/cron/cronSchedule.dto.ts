import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class CronScheduleDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsDateString()
  date: string;
}
