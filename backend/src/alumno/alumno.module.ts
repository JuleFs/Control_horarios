import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Alumno } from '../entities/alumno.entity';
import { AlumnoController } from './alumno.controller';
import { AlumnoService } from './alumno.service';
import { GrupoModule } from '../grupo/grupo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Alumno]),
    GrupoModule,
  ],
  controllers: [AlumnoController],
  providers: [AlumnoService],
  exports: [AlumnoService],
})
export class AlumnoModule {}
