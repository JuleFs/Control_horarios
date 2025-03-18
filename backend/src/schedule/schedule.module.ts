import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { Schedule } from '../entities/schedule.entity';
import { Teacher } from '../entities/teacher.entity';
import { Class } from '../entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Teacher, Class])],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
