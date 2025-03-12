import { Controller, Get, Post, Body } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Teacher } from './teacher.entity';

@Controller('teachers')
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}

  @Post()
  create(@Body() teacher: Teacher) {
    return this.teacherService.create(teacher);
  }

  @Get()
  findAll() {
    return this.teacherService.findAll();
  }
}
