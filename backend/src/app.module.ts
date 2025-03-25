import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from './schedule/schedule.module';
import { AttendanceModule } from './attendance/attendance.module';
<<<<<<< Updated upstream
import { Schedule } from './schedule/schedule.entity';
import { Attendance } from './attendance/attendance.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Student } from './student/student.entity';
import { Teacher } from './teacher/teacher.entity';
import { Class } from './class/class.entity';
import { AppController } from './app.controller';  // Agrega esta línea
import { AppService } from './app.service';  // Agrega esta línea
import { StudentModule } from './student/student.module';  // Agrega si no está
import { TeacherModule } from './teacher/teacher.module';  // Agrega si no está
import { ClassModule } from './class/class.module';  // Agrega si no está
=======
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ClassModule } from './class/class.module';
import { AuthModule } from './auth/auth.module';
import { Schedule } from './entities/schedule.entity';
import { Attendance } from './attendance/attendance.entity';
import { Student } from './entities/student.entity';
import { Teacher } from './entities/teacher.entity';
import { Class } from './entities/class.entity';
import { User } from './entities/user.entity';
>>>>>>> Stashed changes

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
    StudentModule,  // Asegúrate de que todos los módulos estén importados
    TeacherModule,
    ClassModule,
  ],
  controllers: [AppController],  // Agrega esta línea
  providers: [AppService],       // Agrega esta línea
})
export class AppModule {}