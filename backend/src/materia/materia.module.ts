import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Materia } from '../entities/materia.entity';
import { MateriaController } from './materia.controller';
import { MateriaService } from './materia.service';
import { MaestroModule } from '../maestro/maestro.module';
import { SalonModule } from '../salon/salon.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Materia]),
    MaestroModule,
    SalonModule,
  ],
  controllers: [MateriaController],
  providers: [MateriaService],
  exports: [MateriaService],
})
export class MateriaModule {}