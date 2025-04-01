import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from './schedule/schedule.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Schedule } from './schedule/schedule.entity';
import { Attendance } from './attendance/attendance.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Class } from './entities/class.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';

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
        entities: [Schedule, Attendance, Student, Teacher, Class, User],
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    ScheduleModule,
    AttendanceModule,
    StudentModule,
    TeacherModule,
    ClassModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}