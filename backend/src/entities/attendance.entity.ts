import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Student } from './student.entity';
import { Class } from './class.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;

  @Column()
  status: string;

  @ManyToOne(() => Student, (student) => student.attendances)
  student: Student;

  @ManyToOne(() => Class, (class_) => class_.attendances)
  class: Class;
} 