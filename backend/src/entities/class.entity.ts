import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Teacher } from './teacher.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: '' })
  description: string;

  @ManyToOne(() => Teacher, teacher => teacher.classes, { eager: true })
  teacher: Teacher;

  @OneToMany(() => Schedule, schedule => schedule.class)
  schedules: Schedule[];
} 