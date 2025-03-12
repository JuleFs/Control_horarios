import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { AttendanceDto } from './dto/attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post()
  markAttendance(@Body() attendanceDto: AttendanceDto) {
    return this.attendanceService.markAttendance(attendanceDto);
  }

  @Get()
  getAllAttendance() {
    return this.attendanceService.getAllAttendance();
  }

  @Get(':id')
  getAttendanceById(@Param('id') id: number) {
    return this.attendanceService.getAttendanceById(id);
  }
}
