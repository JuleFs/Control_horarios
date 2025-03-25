import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

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
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  classId: number;
} 