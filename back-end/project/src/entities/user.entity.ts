import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Employee } from './employee.entity';


@Entity({ schema: databaseSchemaName, name: 'user'})
export class User {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'is_admin'})
  isAdmin: boolean;

  @Column({name: 'is_accepted'})
  isAccepted: boolean;

  @Column({name: 'password'})
  password: string;
  
  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_id' }) 
  employee: Employee;

}