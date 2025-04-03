import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { Alumno } from '../entities/alumno.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('alumnos')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  create(@Body() createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.alumnoService.create(createAlumnoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<Alumno[]> {
    return this.alumnoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number): Promise<Alumno> {
    return this.alumnoService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: number, @Body() updateAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.alumnoService.update(id, updateAlumnoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.alumnoService.remove(id);
  }
}
