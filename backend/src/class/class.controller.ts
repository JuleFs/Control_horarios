import { Controller, Get, Post, Body } from '@nestjs/common';
import { ClassService } from './class.service';
import { Class } from './class.entity';

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Post()
  create(@Body() classEntity: Class) {
    return this.classService.create(classEntity);
  }

  @Get()
  findAll() {
    return this.classService.findAll();
  }
}
