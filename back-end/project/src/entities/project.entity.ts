import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';


@Entity({ schema: databaseSchemaName, name: 'project'})
export class Project {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;
  
  @Column({name: 'name', type: 'varchar', length: 20})
  name: string;

  @Column({name: 'description', type: 'varchar', length: 1000})
  description: string;

  @Column({name: 'date_started' })
  date_started: Date;

  @Column({name: 'date_to_finish' })
  date_to_finish: Date;

}