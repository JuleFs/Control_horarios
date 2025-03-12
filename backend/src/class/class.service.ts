import { Injectable } from '@nestjs/common';
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
}
