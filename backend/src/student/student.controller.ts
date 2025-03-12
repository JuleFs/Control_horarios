import { Controller, Get, Post, Body } from '@nestjs/common';
import { StudentService } from './student.service';
import { Student } from './student.entity';

@Controller('students')
export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  @Post()
  create(@Body() student: Student) {
    return this.studentService.create(student);
  }

  @Get()
  findAll() {
    return this.studentService.findAll();
  }
}
