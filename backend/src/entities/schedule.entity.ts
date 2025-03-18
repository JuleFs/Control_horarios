import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { Teacher } from './teacher.entity';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => Class, (class_) => class_.schedules)
  class: Class;

  @ManyToOne(() => Teacher, (teacher) => teacher.schedules)
  teacher: Teacher;
} 