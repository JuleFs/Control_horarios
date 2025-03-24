import { Controller, Get, Post, Body, Put, Delete, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from '../entities/student.entity';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('students')
@UseGuards(JwtAuthGuard)
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  async create(@Body() student: Student) {
    try {
      return await this.studentService.create(student);
    } catch (error) {
      throw new HttpException('Error al crear estudiante', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  async findAll() {
    try {
      return await this.studentService.findAll();
    } catch (error) {
      throw new HttpException('Error al obtener estudiantes', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return await this.studentService.findOne(+id);
    } catch (error) {
      throw new HttpException('Error al obtener estudiante', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() student: Student) {
    try {
      return await this.studentService.update(+id, student);
    } catch (error) {
      throw new HttpException('Error al actualizar estudiante', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await this.studentService.remove(+id);
    } catch (error) {
      throw new HttpException('Error al eliminar estudiante', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}