import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Department } from './department.entity';
import { Project } from './project.entity';


@Entity({ schema: databaseSchemaName, name: 'employee'})
export class Employee {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;
  
  @Column({name: 'name', type: 'varchar', length: 255})
  name: string;

  @Column({name: 'surname', type: 'varchar', length: 255})
  surname: string;

  @Column({name: 'email', type: 'varchar', length: 255 })
  email: string;

  @Column({name: 'start_date' })
  startDate: Date;

  @Column({name: 'vacation_days' })
  vacationDays: number;

  @Column({name: 'salary' })
  salary: number;

  @Column({name: 'employment_type', type: 'varchar', length: 255 })
  employmentType: string;

  @ManyToOne(() => Department, (department) => department.id)
  @JoinColumn({ name: 'department_id' }) 
  department: Department;

  @Column({name: 'employee_uid' })
  employeeUid: number;

  @Column({name: 'password', type: 'varchar', length: 20})
  password: string;

  @Column({name: 'is_accepted'})
  isAccepted: boolean;

  @Column({name: 'is_admin'})
  isAdmin: boolean;

}