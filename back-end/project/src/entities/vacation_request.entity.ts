import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';
import { Employee } from './employee.entity';


@Entity({ schema: databaseSchemaName, name: 'vacation_request'})
export class VacationRequest {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @ManyToOne(() => Employee, (employee) => employee.id)
  @JoinColumn({ name: 'employee_id' }) 
  employee: Employee;

  @Column({name: 'start_date' })
  startDate: Date;

  @Column({name: 'end_date' })
  endDate: Date;

  @Column({name: 'status', type: 'varchar', length: 20})
  status: string;

  @Column({name: 'days'})
  days: number;


}