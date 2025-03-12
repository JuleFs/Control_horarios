import { Controller, Get, Post, Body } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { Attendance } from './attendance.entity';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() attendance: Attendance) {
    return this.attendanceService.markAttendance(attendance);
  }

  @Get()
  getAttendance() {
    return this.attendanceService.getAllAttendance();
  }
}
