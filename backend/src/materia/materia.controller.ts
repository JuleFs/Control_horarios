import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { MateriaService } from './materia.service';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { Materia } from '../entities/materia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('materias')
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createMateriaDto: CreateMateriaDto): Promise<Materia> {
    return this.materiaService.create(createMateriaDto);
  }

  @Get()
  findAll(): Promise<Materia[]> {
    return this.materiaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Materia> {
    return this.materiaService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateMateriaDto: CreateMateriaDto): Promise<Materia> {
    return this.materiaService.update(id, updateMateriaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.materiaService.remove(id);
  }
}
