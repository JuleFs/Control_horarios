import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from './schedule/schedule.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({  // Configuración de la BD (ajústala a tu necesidad)
      type: 'sqlite', // o 'mysql', 'postgres', etc.
      database: 'database.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    ScheduleModule,
    AttendanceModule,
  ],
})
export class AppModule {}