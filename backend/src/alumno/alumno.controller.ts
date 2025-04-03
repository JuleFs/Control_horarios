// src/alumno/alumno.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, Request } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { Alumno } from '../entities/alumno.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';

@Controller('alumnos')
export class AlumnoController {
  constructor(private readonly alumnoService: AlumnoService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.alumnoService.create(createAlumnoDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CHECADOR, Role.MAESTRO)
  findAll(): Promise<Alumno[]> {
    return this.alumnoService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CHECADOR, Role.MAESTRO, Role.ALUMNO)
  async findOne(@Request() req, @Param('id') id: number): Promise<Alumno> {
    // Si es alumno, solo puede ver su propio perfil
    if (req.user.userType === Role.ALUMNO && req.user.userId !== id) {
      throw new Error('Solo puedes ver tu propio perfil');
    }
    
    return this.alumnoService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: number, @Body() updateAlumnoDto: CreateAlumnoDto): Promise<Alumno> {
    return this.alumnoService.update(id, updateAlumnoDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.alumnoService.remove(id);
  }
  
  // Endpoint para que un alumno pueda ver su propio perfil
  @Get('me/profile')
  @Roles(Role.ALUMNO)
  async getOwnProfile(@Request() req): Promise<Alumno> {
    return this.alumnoService.findOne(req.user.userId);
  }
  
  // Endpoint para que un alumno pueda ver los horarios de su grupo
  @Get('me/horarios')
  @Roles(Role.ALUMNO)
  async getOwnHorarios(@Request() req): Promise<any> {
    const alumno = await this.alumnoService.findOne(req.user.userId);
    return this.alumnoService.findHorariosByAlumno(alumno.ID_Alumno);
  }
}