import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { Schedule } from './schedule.entity';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  create(@Body() schedule: Schedule) {
    return this.scheduleService.create(schedule);
  }

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() schedule: Schedule) {
    return this.scheduleService.update(+id, schedule);
  }
}
