import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
<<<<<<< Updated upstream
import { ScheduleRepository } from './schedule.repository';
import { Schedule } from './schedule.entity';
=======
import { Repository } from 'typeorm';
import { Schedule } from '../entities/schedule.entity';
import { Student } from '../entities/student.entity';
import { Class } from '../entities/class.entity';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
>>>>>>> Stashed changes

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
<<<<<<< Updated upstream
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
=======
    private scheduleRepository: Repository<Schedule>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
    @InjectRepository(Class)
    private classRepository: Repository<Class>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto): Promise<Schedule> {
    try {
      console.log('Creando horario con datos:', createScheduleDto);
      
      const student = await this.studentRepository.findOne({
        where: { id: createScheduleDto.studentId },
      });

      if (!student) {
        throw new NotFoundException(`Estudiante con ID ${createScheduleDto.studentId} no encontrado`);
      }

      const class_ = await this.classRepository.findOne({
        where: { id: createScheduleDto.classId },
        relations: ['teacher'], // Aseguramos que se cargue el profesor
      });

      if (!class_) {
        throw new NotFoundException(`Clase con ID ${createScheduleDto.classId} no encontrada`);
      }

      const schedule = this.scheduleRepository.create({
        ...createScheduleDto,
        student,
        class: class_,
      });

      const savedSchedule = await this.scheduleRepository.save(schedule);
      console.log('Horario guardado:', savedSchedule);

      // Retornamos el horario con todas sus relaciones
      return await this.findOne(savedSchedule.id);
    } catch (error) {
      console.error('Error al crear horario:', error);
      throw error;
    }
  }

  async findAll(): Promise<Schedule[]> {
    try {
      console.log('Buscando todos los horarios...');
      const schedules = await this.scheduleRepository.find({
        relations: {
          student: true,
          class: {
            teacher: true
          }
        },
        order: {
          id: 'DESC' // Ordenamos por ID descendente para ver los más recientes primero
        }
      });
      console.log(`Se encontraron ${schedules.length} horarios`);
      return schedules;
    } catch (error) {
      console.error('Error al buscar horarios:', error);
      throw error;
    }
  }

  async findOne(id: number): Promise<Schedule> {
    try {
      console.log(`Buscando horario con ID: ${id}`);
      const schedule = await this.scheduleRepository.findOne({
        where: { id },
        relations: {
          student: true,
          class: {
            teacher: true
          }
        }
      });

      if (!schedule) {
        throw new NotFoundException(`Horario con ID ${id} no encontrado`);
      }

      console.log('Horario encontrado:', schedule);
      return schedule;
    } catch (error) {
      console.error(`Error al buscar horario ${id}:`, error);
      throw error;
    }
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto): Promise<Schedule> {
    try {
      console.log(`Actualizando horario ${id} con datos:`, updateScheduleDto);
      const schedule = await this.findOne(id);

      if (updateScheduleDto.studentId) {
        const student = await this.studentRepository.findOne({
          where: { id: updateScheduleDto.studentId },
        });

        if (!student) {
          throw new NotFoundException(`Estudiante con ID ${updateScheduleDto.studentId} no encontrado`);
        }

        schedule.student = student;
      }

      if (updateScheduleDto.classId) {
        const class_ = await this.classRepository.findOne({
          where: { id: updateScheduleDto.classId },
          relations: ['teacher'],
        });

        if (!class_) {
          throw new NotFoundException(`Clase con ID ${updateScheduleDto.classId} no encontrada`);
        }

        schedule.class = class_;
      }

      Object.assign(schedule, updateScheduleDto);
      const updatedSchedule = await this.scheduleRepository.save(schedule);
      console.log('Horario actualizado:', updatedSchedule);
      
      // Retornamos el horario actualizado con todas sus relaciones
      return await this.findOne(updatedSchedule.id);
    } catch (error) {
      console.error(`Error al actualizar horario ${id}:`, error);
      throw error;
    }
  }

  async remove(id: number): Promise<void> {
    try {
      console.log(`Eliminando horario ${id}`);
      const schedule = await this.findOne(id);
      await this.scheduleRepository.remove(schedule);
      console.log(`Horario ${id} eliminado con éxito`);
    } catch (error) {
      console.error(`Error al eliminar horario ${id}:`, error);
      throw error;
    }
>>>>>>> Stashed changes
  }
}