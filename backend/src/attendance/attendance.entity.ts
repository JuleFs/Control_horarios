import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  teacher: string;

  @Column()
  date: string;

  @Column()
  status: string; // 'present' | 'absent' | 'late'
}
