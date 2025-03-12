import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Teacher } from '../teacher/teacher.entity';

@Entity()
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Teacher)
  teacher: Teacher;
}
