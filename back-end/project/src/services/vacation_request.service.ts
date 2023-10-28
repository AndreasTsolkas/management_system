import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';
import { EmployeeService } from 'src/services/employee.service';

import * as Messages from 'src/messages';
import { UserCreateVacationRequest } from 'src/dto/userCreateVacationRequest.dto';
import { VacationRequestStatus} from 'src/enums/vacation.request.status';

@Injectable()
export class VacationRequestService {
  constructor(
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
      return this.vacationRequestRepository
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

  async findByFieldWithRelationships(fieldName: string, fieldValue: string): Promise<VacationRequest[]> {
    const queryBuilder = this.vacationRequestRepository
      .createQueryBuilder('vacation_request')
      .leftJoinAndSelect('vacation_request.employee', 'employee') 
      .where(`vacation_request.${fieldName} = :fieldValue`, { fieldValue });

    return await queryBuilder.getMany();
  }

  async create(vacationRequestData: Partial<VacationRequest>): Promise<VacationRequest> {
    try {
      const newVacationRequest = this.vacationRequestRepository.create(vacationRequestData);
      return this.vacationRequestRepository.save(newVacationRequest);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, vrequestData: Partial<VacationRequest>): Promise<VacationRequest | null> {
    try {
      const vacationRequest = await this.vacationRequestRepository.findOne({ where: { id } });
      if (!vacationRequest) {
        return null; 
      }
      Object.assign(vacationRequest, vrequestData);
      return this.vacationRequestRepository.save(vacationRequest);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.vacationRequestRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  // 

  async findByStatus(status: string) {
    return await this.findByFieldWithRelationships('status', status);
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
   
  async userCreateVacationRequest(userCreateVacationRequestData: UserCreateVacationRequest) {
    try {
      let startDate = new Date(userCreateVacationRequestData.startDate);
      let endDate = new Date(userCreateVacationRequestData.endDate);
      const nonWorkingDays = this.calculateNonWorkingDays(startDate, endDate);
      const vacationDays = this.calculateVacationDays(startDate, 
        endDate, nonWorkingDays);
      const employee = await this.employeeService.findOneWithRelationships
      (userCreateVacationRequestData.employeeId);
      await this.create({employee: employee, startDate: userCreateVacationRequestData.startDate, 
        endDate: userCreateVacationRequestData.endDate, status: VacationRequestStatus['PENDING'], 
        days: vacationDays});
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
      let vacationRequestStatus = 'REJECTED';
      if(approved) {
        vacationRequestStatus = 'APPROVED';
        employee.vacationDays-=vacationRequest.days;
      }
      vacationRequest.status = VacationRequestStatus[vacationRequestStatus];
      result = await this.update(id, vacationRequest);
      await this.employeeService.update(employee.id, employee);
      return result;
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }
}