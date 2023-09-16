import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { databaseSchemaName } from 'src/important';

@Entity({schema: databaseSchemaName, name: 'department'})
export class Department {
  @PrimaryGeneratedColumn({name: 'id'})
  id: number;

  @Column({name: 'name', type: 'varchar', length: 255 })
  name: string;

 
}