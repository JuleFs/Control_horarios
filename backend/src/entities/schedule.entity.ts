import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Class } from './class.entity';
import { Student } from './student.entity';

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

  @ManyToOne(() => Class, { eager: true })
  class: Class;

  @ManyToOne(() => Student, { eager: true })
  student: Student;
} 