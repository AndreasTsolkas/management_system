import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeToProject } from 'src/entities/employee_to_project.entity';

@Module({
  imports: [TypeOrmModule.forFeature([EmployeeToProject])],
  exports: [TypeOrmModule]
})
export class EmployeeToProjectModule {}