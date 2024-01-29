import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Not, Repository, getManager } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeService } from './employee.service';


@Injectable()
export class ProfileService {

  constructor(
    private readonly entityManager: EntityManager,
    private readonly employeeService: EmployeeService,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.employeeService.findAllWithRelationships();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async findAllWithRelationshipsWithNullCondition(field: string, value: string) {
    try {
      return await this.employeeService.findAllWithRelationshipsWithNullCondition(field, value);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<Employee | null> {
    try {
      return this.employeeService.findOneWithRelationships(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }

  async findOneWithRelationshipsBySpecificFieldAndValue(field: string, value: any): Promise<Employee | null> {
    try {
      return this.employeeService.findOneWithRelationshipsBySpecificFieldAndValue(field, value);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
        return this.employeeService.update(id, employeeData);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.employeeService.nulifyEmployeeBonusesAndVrequestsAndRemove(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

}


