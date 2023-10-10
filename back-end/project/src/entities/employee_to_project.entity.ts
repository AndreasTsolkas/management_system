import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Employee } from './employee.entity';
import { Project } from './project.entity';

@Entity({schema: databaseSchemaName, name: 'employee_to_project'})
export class EmployeeToProject {

  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_id' }) 
  employee: Employee;

  @ManyToOne(() => Project, (project) => project.id)
  @JoinColumn({ name: 'project_id' }) 
  project: Project;

  @Column({name: 'date_started' })
  dateStarted: Date;

  @Column({name: 'date_to_end' })
  dateToEnd: Date;

 
}