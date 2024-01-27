import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';

import { Department } from 'src/entities/department.entity';
import { EmployeeService } from 'src/services/employee.service';

import * as Messages from 'src/messages';

@Injectable()
export class DepartmentService {
  
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
    private employeeService: EmployeeService,
  ) {}

  async findAll(): Promise<Department[]> {
    try {
      return await this.departmentRepository.find();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateDepartmentTableError);
    }
  }


  async findOne(id: any): Promise<Department | null> {
    try {
      return await this.departmentRepository.findOneBy({ id });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, departmentData: Partial<Department>): Promise<Department | null> {
    try {
      const department = await this.departmentRepository.findOne({ where: { id } });
      if (!department) {
        return null; 
      }
      Object.assign(department, departmentData);
      return this.departmentRepository.save(department);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(departmentData: Partial<Department>): Promise<Department> {
    try {
      const newDepartment = this.departmentRepository.create(departmentData);
      return this.departmentRepository.save(newDepartment);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async remove(transactionalEntityManager: EntityManager, id: number): Promise<void> {
    try {
      await transactionalEntityManager.delete(Department, id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  /////

  async setEmployeesOutOfThisDepartmentAndRemove(id: number): Promise<void> {
    try {
      await this.entityManager.transaction(async transactionalEntityManager => {
        await this.employeeService.setDepartmentToNullByDepartmentId(transactionalEntityManager, id);
        await this.remove(transactionalEntityManager,id);
      });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}