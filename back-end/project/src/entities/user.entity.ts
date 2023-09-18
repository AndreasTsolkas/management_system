import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Employee } from './employee.entity';


@Entity({ schema: databaseSchemaName, name: 'user'})
export class User {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @PrimaryGeneratedColumn({name: 'is_admin'})
  isAdmin: boolean;

  @PrimaryGeneratedColumn({name: 'is_accepted'})
  isAccepted: boolean;

  @PrimaryGeneratedColumn({name: 'password'})
  password: string;
  
  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_id' }) 
  employee: Employee;

}