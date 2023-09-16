import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Department } from 'src/entities/department.entity';

import * as Messages from 'src/messages';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private departmentRepository: Repository<Department>,
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
      throw new InternalServerErrorException(Messages.updateDepartmentTableError);
    }
  }

  async update(id: any, departmentData: Partial<Department>): Promise<Department | null> {
    try {
      const department = await this.departmentRepository.findOne(id);
      if (!department) {
        return null; 
      }
      Object.assign(department, departmentData);
      return this.departmentRepository.save(department);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateDepartmentTableError);
    }
  }

  async create(departmentData: Partial<Department>): Promise<Department> {
    try {
      const newDepartment = this.departmentRepository.create(departmentData);
      return this.departmentRepository.save(newDepartment);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateDepartmentTableError);
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.departmentRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateDepartmentTableError);
    }
  }
}