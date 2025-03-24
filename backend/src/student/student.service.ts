import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../entities/student.entity';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepository: Repository<Student>,
  ) {}

  async create(student: Student) {
    try {
      return await this.studentRepository.save(student);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.studentRepository.find();
    } catch (error) {
      console.error('Error finding all students:', error);
      throw error;
    }
  }

  async findOne(id: number) {
    try {
      const student = await this.studentRepository.findOne({ where: { id } });
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      return student;
    } catch (error) {
      console.error(`Error finding student with id ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, student: Student) {
    try {
      const existingStudent = await this.findOne(id);
      if (!existingStudent) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      
      await this.studentRepository.update(id, student);
      return this.findOne(id);
    } catch (error) {
      console.error(`Error updating student with id ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number) {
    try {
      const student = await this.findOne(id);
      if (!student) {
        throw new NotFoundException(`Student with ID ${id} not found`);
      }
      
      await this.studentRepository.delete(id);
      return { message: `Student with ID ${id} has been deleted` };
    } catch (error) {
      console.error(`Error removing student with id ${id}:`, error);
      throw error;
    }
  }
}