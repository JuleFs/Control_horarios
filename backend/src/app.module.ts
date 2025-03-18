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
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 3306),
        username: configService.get('DB_USER', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_NAME', 'horarios'),
        entities: [Schedule, Attendance, Student, Teacher, Class, User],
        synchronize: true,
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