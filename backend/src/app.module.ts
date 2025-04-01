import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScheduleModule } from './schedule/schedule.module';
import { AttendanceModule } from './attendance/attendance.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { AuthModule } from './auth/auth.module';
import { Schedule } from './entities/schedule.entity';
import { Attendance } from './entities/attendance.entity';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Class } from './entities/class.entity';
import { User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USER', 'postgres'),
        password: configService.get('DB_PASSWORD', 'admin'),
        database: configService.get('DB_NAME', 'school_schedule'),
        entities: [Schedule, Attendance, Student, Teacher, Class, User],
        synchronize: configService.get('DB_SYNC', true),
        logging: true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
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