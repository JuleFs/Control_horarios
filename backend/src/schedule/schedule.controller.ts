import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleDto } from './dto/schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() scheduleDto: ScheduleDto) {
    return this.scheduleService.create(scheduleDto);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.scheduleService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() scheduleDto: ScheduleDto) {
    return this.scheduleService.update(id, scheduleDto);
  }
}
