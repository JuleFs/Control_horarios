import { IsString, IsNotEmpty } from 'class-validator';

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  day: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  teacherId: number;

  @IsNotEmpty()
  classId: number;
} 