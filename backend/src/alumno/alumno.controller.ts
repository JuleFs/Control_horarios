// src/alumno/alumno.controller.ts
import { Controller, Get, Post, Body, Param, Put, Delete, ForbiddenException, UseGuards, Req } from '@nestjs/common';
import { AlumnoService } from './alumno.service';
import { CreateAlumnoDto } from './dto/create-alumno.dto';
import { Alumno } from '../entities/alumno.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { Public } from '../auth/decorators/public.decorator';
import { HorarioService } from '../horario/horario.service';
import { AsistenciaService } from '../asistencia/asistencia.service';
import { CreateAsistenciaDto } from '../asistencia/dto/create-asistencia.dto';
import { Asistencia } from '../entities/asistencia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/user.decorator';

interface CrearAsistencia {
  user: any;
  asistencia: CreateAsistenciaDto;
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('alumnos')
export class AlumnoController {
  constructor(
    private readonly alumnoService: AlumnoService,
    private readonly horarioService: HorarioService,
    private readonly asistenciaService: AsistenciaService,
  ) {}

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
  async findOne(
    @GetUser('userType') userType: Role,
    @GetUser('userId') userId: number,
    @Param('id') id: number
  ): Promise<Alumno> {
    // Si es alumno, solo puede ver su propio perfil
    if (userType === Role.ALUMNO && userId !== +id) {
      throw new ForbiddenException('Solo puedes ver tu propio perfil');
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
  async getOwnProfile(@Req() req): Promise<Alumno> {
    return this.alumnoService.findOne(req.body.user.id);
  }
  
  // Endpoint para que un alumno pueda ver los horarios de su grupo
  @Post('me/horarios')
  @Roles(Role.ALUMNO)
  async getOwnHorarios(@Req() req): Promise<any> {
    const alumno = await this.alumnoService.findOne(req.body.user.id);
    return this.horarioService.findByGrupo(alumno.Grupo.ID_Grupo);
  }
  
  // Nuevo endpoint para que un alumno pueda registrar su asistencia a un horario específico
  @Post('me/asistencia')
  @Roles(Role.ALUMNO)
  async registerOwnAttendance(
    @Body() asistencia: CrearAsistencia
  ): Promise<any> {
    const alumno = await this.alumnoService.findOne(asistencia.user.id);
    const horario = await this.horarioService.findOne(asistencia.asistencia.Horario_ID);
    
    // Verificar que el horario pertenezca al grupo del alumno
    if (horario.Grupo.ID_Grupo !== alumno.Grupo.ID_Grupo) {
      throw new ForbiddenException('No puedes registrar asistencia para un horario que no pertenece a tu grupo');
    }
    
    return this.asistenciaService.create(asistencia.asistencia);
  }
  
  // Nuevo endpoint para que un alumno pueda ver sus propias asistencias
  @Post('me/asistencias')
  @Roles(Role.ALUMNO)
  async getOwnAttendance(@Req() req): Promise<any> {
    const alumno = await this.alumnoService.findOne(req.body.user.id);
    const horarios = await this.horarioService.findByGrupo(alumno.Grupo.ID_Grupo);
    
    // Obtener las asistencias para todos los horarios del grupo del alumno
    const asistencias: Asistencia[] = [];
    for (const horario of horarios) {
      const horarioAsistencias = await this.asistenciaService.findByHorario(horario.ID);
      asistencias.push(...horarioAsistencias);
    }
    
    return asistencias;
  }
}