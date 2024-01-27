import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Not, Repository, getManager } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { UtilityService } from './utility.service';


@Injectable()
export class EmployeeService {

  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(Employee)
    private employeesRepository: Repository<Employee>,
    private readonly utilityService: UtilityService,
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

  async findOneWithRelationshipsBySpecificFieldAndValue(field: string, value: any): Promise<Employee | null> {
    try {
      return this.employeesRepository
        .createQueryBuilder('employee')
        .leftJoinAndSelect('employee.department', 'department')
        .where(`employee.${field} = :value`, { value })
        .getOne();
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, employeeData: Partial<Employee>, transactionalEntityManager?: EntityManager): Promise<Employee | null> {
    try {
        const employee = await this.employeesRepository.findOne({ where: { id } });
  
        if (!employee) 
          return null;
  
        Object.assign(employee, employeeData);
  
        if (transactionalEntityManager) {
          await transactionalEntityManager
            .createQueryBuilder()
            .update(Employee)
            .set(employeeData)
            .where('id = :id', { id })
            .execute();

        } 
        else await this.employeesRepository.save(employee);
        
        return employee;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(employeeData: Partial<Employee> ): Promise<Employee> {
    try {
      const newEmployee = await this.employeesRepository.create(employeeData);
      return this.employeesRepository.save(newEmployee);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, transactionalEntityManager?: EntityManager): Promise<void> {
    try {
      await transactionalEntityManager.delete(Employee, id);
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

  ///

  async getEmployeesAvailableForVacation(): Promise<Employee[]> {
    try {
      const query = this.employeesRepository.createQueryBuilder('e')
        .select(['e', 'department']) 
        .leftJoin('e.department', 'department') 
        .where(qb => {
          const subQuery = qb.subQuery()
            .select('DISTINCT vr.employee_id')
            .from('vacation_request', 'vr')
            .where('NOW() BETWEEN vr.start_date AND vr.end_date')
            .andWhere('vr.status = :status', { status: 'approved' })
            .getQuery();
          return `e.id NOT IN ${subQuery}`;
        })
        
        .groupBy('e.id, department.id'); 

      const result = await query.getMany(); 
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async findOneWithRelationshipsAndCheckIfIsOnVacation(id: number) {
    try {
      let employee = await this.findOneWithRelationships(id);
      let isOnVacation = false;
      let hasMadeRequestRecently = false;
      if(await this.utilityService.hasVacationRequestWithEmployeeId(employee.id)) {
        isOnVacation = await this.utilityService.isEmployeeOnVacation(employee.id);
        hasMadeRequestRecently = await this.utilityService.hasPendingRequest(employee.id);
      }
      return {
        employee: employee, 
        isOnVacation: isOnVacation,
        hasMadeRequestRecently: hasMadeRequestRecently
      };
    } 
    catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async setDepartmentToNullByDepartmentId(transactionalEntityManager: EntityManager, departmentId: number): Promise<void> {
    await transactionalEntityManager
      .createQueryBuilder()
      .update(Employee)
      .set({ department: null })
      .where('department = :departmentId', { departmentId })
      .execute();
  }

  async nulifyEmployeeBonusesAndVrequestsAndRemove(id: number): Promise<void> {
    try {
      await this.entityManager.transaction(async transactionalEntityManager => {
        await this.utilityService.setVacationrequestToNullByDepartmentId(transactionalEntityManager, id);
        await this.utilityService.setBonusToNullByDepartmentId(transactionalEntityManager, id);
        await this.remove(id, transactionalEntityManager);
      });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

}


