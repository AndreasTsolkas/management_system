import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';

import * as Messages from 'src/messages';
import { EmployeeToProject } from 'src/entities/employee_to_project.entity';

@Injectable()
export class EmployeeToProjectService {
  constructor(
    @InjectRepository(EmployeeToProject)
    private employeeToProjectRepository: Repository<EmployeeToProject>,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.employeeToProjectRepository.find({ relations: ['employee', 'project'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<EmployeeToProject | null> {
    try {
      return this.employeeToProjectRepository
      .createQueryBuilder('employee_to_project')
      .leftJoinAndSelect('employee_to_project.employee', 'employee')
      .where('employee_to_project.employee_id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }


  async create(employeeToProjectData: Partial<EmployeeToProject>): Promise<EmployeeToProject> {
    try {
      const newEmployee = this.employeeToProjectRepository.create(employeeToProjectData);
      return this.employeeToProjectRepository.save(newEmployee);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.employeeToProjectRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }
}