import { Injectable } from '@nestjs/common';
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
}
