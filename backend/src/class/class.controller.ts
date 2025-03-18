import { Controller, Get, Post, Body, Put, Delete, Param } from '@nestjs/common';
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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.classService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() classEntity: Class) {
    return this.classService.update(+id, classEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.classService.remove(+id);
  }
}