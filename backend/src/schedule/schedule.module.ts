import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
<<<<<<< Updated upstream
import { Schedule } from './schedule.entity';
import { ScheduleRepository } from './schedule.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule])],
=======
import { Schedule } from '../entities/schedule.entity';
import { Student } from '../entities/student.entity';
import { Class } from '../entities/class.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Schedule, Student, Class])],
>>>>>>> Stashed changes
  controllers: [ScheduleController],
  providers: [ScheduleService, ScheduleRepository],
})
export class ScheduleModule {}
