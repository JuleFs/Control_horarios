import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Teacher } from './teacher.entity';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepository: Repository<Teacher>,
  ) {}

  async create(teacher: Teacher) {
    return this.teacherRepository.save(teacher);
  }

  async findAll() {
    return this.teacherRepository.find();
  }

  async findOne(id: number) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    return teacher;
  }

  async update(id: number, teacher: Teacher) {
    const existingTeacher = await this.findOne(id);
    if (!existingTeacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    
    await this.teacherRepository.update(id, teacher);
    return this.findOne(id);
  }

  async remove(id: number) {
    const teacher = await this.findOne(id);
    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${id} not found`);
    }
    
    await this.teacherRepository.delete(id);
    return { message: `Teacher with ID ${id} has been deleted` };
  }
}