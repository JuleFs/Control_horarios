import { Injectable } from '@nestjs/common';
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
    return await this.scheduleRepository.findOne({ where: { id } });
  }

  async update(id: number, schedule: Schedule) {
    return await this.scheduleRepository.update(id, schedule);
  }
}
