import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './class.entity';

@Injectable()
export class ClassService {
  constructor(
    @InjectRepository(Class)
    private readonly classRepository: Repository<Class>,
  ) {}

  async create(classEntity: Class) {
    return this.classRepository.save(classEntity);
  }

  async findAll() {
    return this.classRepository.find({ relations: ['teacher'] });
  }

  async findOne(id: number) {
    const classEntity = await this.classRepository.findOne({
      where: { id },
      relations: ['teacher']
    });
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    return classEntity;
  }

  async update(id: number, classEntity: Class) {
    const existingClass = await this.findOne(id);
    if (!existingClass) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    
    await this.classRepository.update(id, classEntity);
    return this.findOne(id);
  }

  async remove(id: number) {
    const classEntity = await this.findOne(id);
    if (!classEntity) {
      throw new NotFoundException(`Class with ID ${id} not found`);
    }
    
    await this.classRepository.delete(id);
    return { message: `Class with ID ${id} has been deleted` };
  }
}