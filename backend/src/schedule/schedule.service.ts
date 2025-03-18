import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Teacher } from '../entities/teacher.entity';
import { Class } from '../entities/class.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    const teacher = await this.teacherRepository.findOne({
      where: { id: createScheduleDto.teacherId },
    });

    if (!teacher) {
      throw new NotFoundException(`Teacher with ID ${createScheduleDto.teacherId} not found`);
    }

    const class_ = await this.classRepository.findOne({
      where: { id: createScheduleDto.classId },
    });

    if (!class_) {
      throw new NotFoundException(`Class with ID ${createScheduleDto.classId} not found`);
    }

    const schedule = this.scheduleRepository.create({
      ...createScheduleDto,
      teacher,
      class: class_,
    });

    return await this.scheduleRepository.save(schedule);
  }

  async findAll(): Promise<Schedule[]> {
    return await this.scheduleRepository.find({
      relations: ['teacher', 'class'],
    });
  }

  async findOne(id: number): Promise<Schedule> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id },
      relations: ['teacher', 'class'],
    });

    if (!schedule) {
      throw new NotFoundException(`Schedule with ID ${id} not found`);
    }

    return schedule;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    const schedule = await this.findOne(id);

    if (updateScheduleDto.teacherId) {
      const teacher = await this.teacherRepository.findOne({
        where: { id: updateScheduleDto.teacherId },
      });

      if (!teacher) {
        throw new NotFoundException(`Teacher with ID ${updateScheduleDto.teacherId} not found`);
      }

      schedule.teacher = teacher;
    }

    if (updateScheduleDto.classId) {
      const class_ = await this.classRepository.findOne({
        where: { id: updateScheduleDto.classId },
      });

      if (!class_) {
        throw new NotFoundException(`Class with ID ${updateScheduleDto.classId} not found`);
      }

      schedule.class = class_;
    }

    Object.assign(schedule, updateScheduleDto);
    return await this.scheduleRepository.save(schedule);
  }

  async remove(id: number): Promise<void> {
    const schedule = await this.findOne(id);
    await this.scheduleRepository.remove(schedule);
  }
}