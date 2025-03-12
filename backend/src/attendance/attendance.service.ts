import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceDto } from './dto/attendance.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepository: Repository<Attendance>,
  ) {}

  markAttendance(attendanceDto: AttendanceDto) {
    const attendance = this.attendanceRepository.create(attendanceDto);
    return this.attendanceRepository.save(attendance);
  }

  getAllAttendance() {
    return this.attendanceRepository.find();
  }

  getAttendanceById(id: number) {
    return this.attendanceRepository.findOneBy({ id });
  }
}
