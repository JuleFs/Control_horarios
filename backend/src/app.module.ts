import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from './schedule/schedule.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Schedule } from './schedule/schedule.entity';
import { Attendance } from './attendance/attendance.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Student } from './student/student.entity';
import { Teacher } from './teacher/teacher.entity';
import { Class } from './class/class.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'admin',
        database: 'school_schedule',
        entities: [Schedule, Attendance, Student, Teacher, Class],
        synchronize: true,
      }),
    }),
    ScheduleModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}