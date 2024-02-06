import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository, EntityManager, getManager } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';
import { EmployeeService } from 'src/services/employee.service';

import { CreateVacationRequest } from 'src/dto/create.vacationRequest.dto';
import { VacationRequestStatus} from 'src/enums/vacation.request.status';
@Injectable()
export class VacationRequestService {
  constructor(
    private entityManager : EntityManager,
    @InjectRepository(VacationRequest)
    private vacationRequestRepository: Repository<VacationRequest>,
    private employeeService: EmployeeService
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.vacationRequestRepository.find({ relations: ['employee','employee.department'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }

  async findOneWithRelationships(id: number): Promise<VacationRequest | null> {
    try {
      return await this.vacationRequestRepository
      .createQueryBuilder('vacation_request')
      .leftJoinAndSelect('vacation_request.employee', 'employee') 
      .leftJoinAndSelect('employee.department', 'department')
      .where('vacation_request.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findByFieldWithRelationships(fieldName: string, fieldValue: string): Promise<VacationRequest[] | null> {
    const queryBuilder = await this.vacationRequestRepository
      .createQueryBuilder('vacation_request')
      .leftJoinAndSelect('vacation_request.employee', 'employee')
      .where(`vacation_request.${fieldName} = :fieldValue`, { fieldValue });
  
    const results = await queryBuilder.getMany();
 
    if (results.length === 0) 
      return null;
  
    return results;
  }

  async create(vacationRequestData: Partial<VacationRequest>): Promise<VacationRequest> {
    try {
      const newVacationRequest = await this.vacationRequestRepository.create(vacationRequestData);
      return await this.vacationRequestRepository.save(newVacationRequest);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, vacationRequestData: Partial<VacationRequest>, transactionalEntityManager?: EntityManager): Promise<VacationRequest | null> {
    try {
        const vacationRequest = await this.vacationRequestRepository.findOne({ where: { id } });
  
        if (!vacationRequest) 
          return null;
  
        Object.assign(vacationRequest, vacationRequestData);
  
        if (transactionalEntityManager) {
          await transactionalEntityManager
            .createQueryBuilder()
            .update(VacationRequest)
            .set(vacationRequestData)
            .where('id = :id', { id })
            .execute();

        } 
        else await await this.vacationRequestRepository.save(vacationRequestData);
        
        return vacationRequest;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await await this.vacationRequestRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }



  // 

  async findByStatus(status: string) {
    let areDataExist = true;
    let result = await this.findByFieldWithRelationships('status', status);
    if(result === null) 
      areDataExist = false;

    return {
      result,
      areDataExist
    }
  }

  private calculateVacationDays(startDate: Date, endDate: Date, nonWorkingDays: number) {

    let result = 0;
    const differenceInMs = endDate.getTime() - startDate.getTime();
    const differnceInDays =  differenceInMs /  (1000 * 60 * 60 * 24);
    result = (differnceInDays - nonWorkingDays)+1;
    return result;

  }

  private calculateNonWorkingDays(startDate: Date, endDate: Date) {
    const nonWorkingDays: number[] = [0, 6]; 
    let nonWorkingDaysCount = 0;
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      if (nonWorkingDays.includes(currentDate.getDay())) 
        nonWorkingDaysCount++;
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    console.log(nonWorkingDaysCount);
    return nonWorkingDaysCount;
  }
   
  async createVacationRequest(createVacationRequest: CreateVacationRequest, userCreated: boolean) {
    try {
      let newVacationRequest;
      let statusValue = 'APPROVED';
      let startDate = new Date(createVacationRequest.startDate);
      let endDate = new Date(createVacationRequest.endDate);
      const nonWorkingDays = this.calculateNonWorkingDays(startDate, endDate);
      const vacationDays = this.calculateVacationDays(startDate, 
        endDate, nonWorkingDays);
      const employee = await this.employeeService.findOneWithRelationships
      (createVacationRequest.employeeId, false);
      if(userCreated) 
        statusValue = 'PENDING';
      newVacationRequest = await this.create({employee: employee, startDate: createVacationRequest.startDate, 
        endDate: createVacationRequest.endDate, status: VacationRequestStatus[statusValue], 
        days: vacationDays});
      return {
        vacationDays, newVacationRequest
      };
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async userCreateVacationRequest(createVacationRequest: CreateVacationRequest) {
    try {
      let {newVacationRequest} = await this.createVacationRequest(createVacationRequest, true);
      return newVacationRequest;
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async adminCreateVacationRequest(createVacationRequest: CreateVacationRequest) {
    try {
      let {vacationDays, newVacationRequest} = await this.createVacationRequest(createVacationRequest, false);
      const employee = await this.employeeService.findOneWithRelationships
      (createVacationRequest.employeeId, false);
      employee.vacationDays-=vacationDays;
      await this.employeeService.update(createVacationRequest.employeeId, employee);
      return newVacationRequest;
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async evaluateVacationRequest(id: number, approved: boolean) {
    try {
      let result:any = null;
      const vacationRequest: VacationRequest = await this.findOneWithRelationships(id);
      const employee = vacationRequest.employee;
      let vacationRequestStatus = 'rejected';
      if(approved) {
        vacationRequestStatus = 'approved';
        employee.vacationDays-=vacationRequest.days;
      }
      vacationRequest.status = VacationRequestStatus[vacationRequestStatus];
      await this.entityManager.transaction(async transactionalEntityManager => {
        result = await this.update(id, vacationRequest, transactionalEntityManager);
        await this.employeeService.update(employee.id, employee, transactionalEntityManager);
      })

      return result;
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }
  
  async getVacationRequestsByEmployeeId(employeeId: number, status?: string) {
    try {
      const queryBuilder = this.vacationRequestRepository
        .createQueryBuilder('vacation_request')
        .where('vacation_request.employee_id = :employeeId', { employeeId });
  
      if (status) {
        queryBuilder.andWhere('vacation_request.status = :status', { status });
      }
  
      const result = await queryBuilder.getMany();
      return result;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async countVacationRequestsByEmployeeId(employeeId: number, status?: string) {
    try {

      const vacationRequestByEmployeeId = await this.getVacationRequestsByEmployeeId(employeeId);
      return vacationRequestByEmployeeId.length;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async hasVacationRequestWithEmployeeId(employeeId: number) {
    try {
      const count = await this.countVacationRequestsByEmployeeId(employeeId);
      return count > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async handleOutdatedPendingRequests() {
    const currentDate = new Date();
    
    const pendingRequests = await this.vacationRequestRepository.find({
      where: {
        status: 'pending',
        endDate: LessThan(currentDate),
      },
    });

    if (pendingRequests.length > 0) {
      await Promise.all(pendingRequests.map(request => {
        request.status = 'rejected';
        return this.vacationRequestRepository.save(request);
      }));
    }
  }

  async getApprovedVacationRequestsNumByEmployeeId(employeeId: number) {
    try {
      let status = 'approved';
      return await this.countVacationRequestsByEmployeeId(employeeId, status);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async getLastVacationRequestByEmployeeId(employeeId: number) {
    try {
      const vacationRequestsByEmployeeId = await this.getVacationRequestsByEmployeeId(employeeId);
  
      const sortedVacationRequests = vacationRequestsByEmployeeId.sort((a, b) => {
        const startDateDiff = new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
        if (startDateDiff !== 0) {
          return startDateDiff;
        }
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime();
      });
  
      return sortedVacationRequests.length > 0 ? sortedVacationRequests[0] : null;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}