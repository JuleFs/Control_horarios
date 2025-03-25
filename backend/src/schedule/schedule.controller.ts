<<<<<<< Updated upstream
import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
=======
import { Controller, Get, Post, Body, Put, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
>>>>>>> Stashed changes
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';

@Controller('schedules')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
<<<<<<< Updated upstream
  create(@Body() schedule: Schedule) {
    return this.scheduleService.create(schedule);
=======
  async create(@Body() createScheduleDto: CreateScheduleDto) {
    try {
      const schedule = await this.scheduleService.create(createScheduleDto);
      return {
        message: 'Horario creado exitosamente',
        data: schedule
      };
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw new HttpException(
        error.message || 'Error al crear el horario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
>>>>>>> Stashed changes
  }

  @Get()
  async findAll() {
    try {
      const schedules = await this.scheduleService.findAll();
      return {
        message: 'Horarios obtenidos exitosamente',
        data: schedules
      };
    } catch (error) {
      console.error('Error al obtener horarios:', error);
      throw new HttpException(
        error.message || 'Error al obtener los horarios',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const schedule = await this.scheduleService.findOne(+id);
      return {
        message: 'Horario obtenido exitosamente',
        data: schedule
      };
    } catch (error) {
      console.error(`Error al obtener horario ${id}:`, error);
      throw new HttpException(
        error.message || 'Error al obtener el horario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Put(':id')
<<<<<<< Updated upstream
  update(@Param('id') id: string, @Body() schedule: Schedule) {
    return this.scheduleService.update(+id, schedule);
=======
  async update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto) {
    try {
      const schedule = await this.scheduleService.update(+id, updateScheduleDto);
      return {
        message: 'Horario actualizado exitosamente',
        data: schedule
      };
    } catch (error) {
      console.error(`Error al actualizar horario ${id}:`, error);
      throw new HttpException(
        error.message || 'Error al actualizar el horario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
>>>>>>> Stashed changes
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      await this.scheduleService.remove(+id);
      return {
        message: 'Horario eliminado exitosamente'
      };
    } catch (error) {
      console.error(`Error al eliminar horario ${id}:`, error);
      throw new HttpException(
        error.message || 'Error al eliminar el horario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}