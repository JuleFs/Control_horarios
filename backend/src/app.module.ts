import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GrupoModule } from './grupo/grupo.module';
import { AlumnoModule } from './alumno/alumno.module';
import { MaestroModule } from './maestro/maestro.module';
import { ChecadorModule } from './checador/checador.module';
import { SalonModule } from './salon/salon.module';
import { MateriaModule } from './materia/materia.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', 'admin12'),
        database: configService.get('DB_NAME', 'horarios_escolares'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
      }),
    }),
    GrupoModule,
    AlumnoModule,
    MaestroModule,
    ChecadorModule,
    SalonModule,
    MateriaModule,
  ],
})
export class AppModule {}

