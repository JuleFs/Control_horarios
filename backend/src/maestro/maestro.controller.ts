import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MaestroService } from './maestro.service';
import { CreateMaestroDto } from './dto/create-maestro.dto';
import { Maestro } from '../entities/maestro.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('maestros')
export class MaestroController {
  constructor(private readonly maestroService: MaestroService) {}

  @Post()
  create(@Body() createMaestroDto: CreateMaestroDto): Promise<Maestro> {
    return this.maestroService.create(createMaestroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Maestro[]> {
    return this.maestroService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Maestro> {
    return this.maestroService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateMaestroDto: CreateMaestroDto): Promise<Maestro> {
    return this.maestroService.update(id, updateMaestroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.maestroService.remove(id);
  }
}
