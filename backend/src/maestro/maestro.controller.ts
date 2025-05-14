import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  ForbiddenException,
  Req,
} from '@nestjs/common';
import { MaestroService } from './maestro.service';
import { CreateMaestroDto } from './dto/create-maestro.dto';
import { Maestro } from '../entities/maestro.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { MateriaService } from '../materia/materia.service';
import { HorarioService } from '../horario/horario.service';
import { AsistenciaService } from '../asistencia/asistencia.service';
import { Asistencia } from '../entities/asistencia.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/user.decorator';
import { request } from 'http';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('maestros')
export class MaestroController {
  constructor(
    private readonly maestroService: MaestroService,
    private readonly materiaService: MateriaService,
    private readonly horarioService: HorarioService,
    private readonly asistenciaService: AsistenciaService,
  ) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createMaestroDto: CreateMaestroDto): Promise<Maestro> {
    return this.maestroService.create(createMaestroDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.CHECADOR)
  findAll(): Promise<Maestro[]> {
    return this.maestroService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.CHECADOR, Role.MAESTRO)
  async findOne(
    @GetUser('userType') userType: Role,
    @GetUser('userId') userId: number,
    @Param('id') id: number,
  ): Promise<Maestro> {
    // Si es maestro, solo puede ver su propio perfil
    if (userType === Role.MAESTRO && userId !== +id) {
      throw new ForbiddenException('Solo puedes ver tu propio perfil');
    }

    return this.maestroService.findOne(id);
  }

  @Put(':id')
  @Roles(Role.ADMIN)
  update(
    @Param('id') id: number,
    @Body() updateMaestroDto: CreateMaestroDto,
  ): Promise<Maestro> {
    return this.maestroService.update(id, updateMaestroDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: number): Promise<void> {
    return this.maestroService.remove(id);
  }

  // Nuevo endpoint para que un maestro pueda ver su propio perfil
  @Post('me/profile')
  @Roles(Role.MAESTRO)
  async getOwnProfile(@Req() req): Promise<Maestro> {
    return this.maestroService.findOne(req.body.user.id);
  }

  // Nuevo endpoint para que un maestro pueda ver sus propias materias
  @Post('me/materias')
  @Roles(Role.MAESTRO)
  async getOwnMaterias(@Req() req): Promise<any> {
    return this.materiaService.findByMaestro(req.body.user.id);
  }

  // Nuevo endpoint para que un maestro pueda ver los horarios de sus materias
  @Post('me/horarios')
  @Roles(Role.MAESTRO)
  async getOwnHorarios(@Req() req): Promise<any> {
    return this.horarioService.findByMaestroId(req.body.user.id);
  }

  // Nuevo endpoint para que un maestro pueda ver las asistencias de sus materias
  @Post('me/asistencias')
  @Roles(Role.MAESTRO)
  async getOwnAsistencias(@Req() req): Promise<any> {
    const horarios = await this.horarioService.findByMaestroId(req.body.user.id);

    // Obtener las asistencias para todos los horarios de las materias del maestro
    const asistencias: Asistencia[] = [];
    for (const horario of horarios) {
      const horarioAsistencias = await this.asistenciaService.findByHorario(
        horario.ID,
      );
      asistencias.push(...horarioAsistencias);
    }

    return asistencias;
  }
}
