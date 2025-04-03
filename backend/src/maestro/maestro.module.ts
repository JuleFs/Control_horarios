import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Maestro } from '../entities/maestro.entity';
import { MaestroController } from './maestro.controller';
import { MaestroService } from './maestro.service';

@Module({
  imports: [TypeOrmModule.forFeature([Maestro])],
  controllers: [MaestroController],
  providers: [MaestroService],
  exports: [MaestroService],
})
export class MaestroModule {}
