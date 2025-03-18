import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column()
  role: 'admin' | 'teacher' | 'student';

  @Column()
  name: string;

  // Para profesores y estudiantes, referencia a su ID específico
  @Column({ nullable: true })
  referenceId: number;
} 