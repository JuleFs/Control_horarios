import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AttendanceRepository } from './attendance.repository';
import { Attendance } from './attendance.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: AttendanceRepository,
  ) {}

  async markAttendance(attendance: Attendance) {
    return await this.attendanceRepository.save(attendance);
  }

  async getAllAttendance() {
    return await this.attendanceRepository.find();
  }

  async findOne(id: number) {
    const attendance = await this.attendanceRepository.findOne({ where: { id } });
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    return attendance;
  }

  async update(id: number, attendance: Attendance) {
    const existingAttendance = await this.findOne(id);
    if (!existingAttendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    
    await this.attendanceRepository.update(id, attendance);
    return this.findOne(id);
  }

  async remove(id: number) {
    const attendance = await this.findOne(id);
    if (!attendance) {
      throw new NotFoundException(`Attendance with ID ${id} not found`);
    }
    
    await this.attendanceRepository.delete(id);
    return { message: `Attendance with ID ${id} has been deleted` };
  }
}