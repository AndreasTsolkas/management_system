import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Employee } from './employee.entity';
import { Department } from './department.entity';


@Entity({ schema: databaseSchemaName, name: 'bonus'})
export class Bonus {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_id' }) 
  employee: Employee;

  @Column({name: 'amount' })
  amount: number;


}