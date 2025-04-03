import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Checador } from '../entities/checador.entity';
import { ChecadorController } from './checador.controller';
import { ChecadorService } from './checador.service';

@Module({
  imports: [TypeOrmModule.forFeature([Checador])],
  controllers: [ChecadorController],
  providers: [ChecadorService],
  exports: [ChecadorService],
})
export class ChecadorModule {}

// src/checador/dto/create-checador.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateChecadorDto {
  @IsNotEmpty()
  @IsEmail()
  Correo: string;

  @IsNotEmpty()
  @IsString()
  Contraseña: string;
}
