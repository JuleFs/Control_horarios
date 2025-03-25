import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from '../entities/teacher.entity';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
    private readonly authService: AuthService,
  ) {}

  async create(teacher: Teacher) {
    try {
      return await this.teacherRepository.save(teacher);
    } catch (error) {
      console.error('Error creating teacher:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.teacherRepository.find();
    } catch (error) {
      console.error('Error finding all teachers:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const teacher = await this.teacherRepository.findOne({ where: { id } });
      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      return teacher;
    } catch (error) {
      console.error(`Error finding teacher with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, teacher: Teacher) {
    try {
      const existingTeacher = await this.findOne(id);
      if (!existingTeacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      
      // Actualizar el profesor
      await this.teacherRepository.update(id, teacher);
      
      // Actualizar el usuario correspondiente
      await this.authService.updateUser(existingTeacher.email, {
        email: teacher.email,
        name: teacher.name,
      });

      return this.findOne(id);
    } catch (error) {
      console.error(`Error updating teacher with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const teacher = await this.findOne(id);
      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${id} not found`);
      }
      
      // Eliminar el usuario correspondiente
      await this.authService.deleteUser(teacher.email);
      
      // Eliminar el profesor
      await this.teacherRepository.delete(id);
      return { message: `Teacher with ID ${id} has been deleted` };
    } catch (error) {
      console.error(`Error removing teacher with id ${id}:`, error);
      throw error;
    }
  }
}