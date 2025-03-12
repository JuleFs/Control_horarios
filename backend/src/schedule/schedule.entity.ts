import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  subject: string;

  @Column()
  teacher: string;

  @Column()
  day: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}
