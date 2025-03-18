import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ScheduleRepository } from './schedule.repository';
import { Schedule } from './schedule.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private readonly scheduleRepository: ScheduleRepository,
  ) {}

  async create(schedule: Schedule) {
    return await this.scheduleRepository.save(schedule);
  }

  async findAll() {
    return await this.scheduleRepository.find();
  }

  async findOne(id: number) {
    const schedule = await this.scheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: number, schedule: Schedule) {
    const existingSchedule = await this.findOne(id);
    if (!existingSchedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    
    await this.scheduleRepository.update(id, schedule);
    return this.findOne(id);
  }

  async remove(id: number) {
    const schedule = await this.findOne(id);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }
    
    await this.scheduleRepository.delete(id);
    return { message: `Schedule with ID ${id} has been deleted` };
  }
}