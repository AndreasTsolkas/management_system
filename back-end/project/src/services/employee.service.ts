import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository, getManager } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';

import * as Messages from 'src/messages';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.employeesRepository.find({ relations: ['department'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findAllWithRelationshipsWithNullCondition(field: string, value: string) {
    try {
      let whereCondition: Record<string, any> = {};
      let relationshipArray: any | null = null;
  
      if (value.toLowerCase() === 'null') {
        whereCondition[field] = IsNull();
      } 
      else if(value.toLowerCase() === 'notnull') {
        relationshipArray = ['department'];
         whereCondition[field] = Not(IsNull()) ;
      }
      else throw new BadRequestException();
  
      const queryOptions: any = {
        where: whereCondition,
      };
  
      if (relationshipArray) {
        queryOptions.relations = relationshipArray;
      }
  
      return await this.employeesRepository.find(queryOptions);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<Employee | null> {
    try {
      return this.employeesRepository
      .createQueryBuilder('employee')
      .leftJoinAndSelect('employee.department', 'department')
      .where('employee.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }

  async update(id: number, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
      const employee = await this.employeesRepository.findOneBy({id});
      if (!employee) 
        return null; 

      Object.assign(employee, employeeData);
      return this.employeesRepository.save(employee);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }

  async create(employeeData: Partial<Employee>): Promise<Employee> {
    try {
      const newEmployee = this.employeesRepository.create(employeeData);
      return this.employeesRepository.save(newEmployee);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.employeesRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async countDepartmentExistenceInEmployee(departmentId: number) {
    const employeesWithDepartment = await this.employeesRepository.find({
      where: {
        department: {
          id: departmentId
        }
      }
    });
    return {
      count: employeesWithDepartment.length,
      employees: employeesWithDepartment
    };
  }


  



}