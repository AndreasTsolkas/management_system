import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';


import * as Messages from 'src/messages';


@Injectable()
export class UtilityService {
  constructor(
    @InjectRepository(VacationRequest)
    private vacationRequestRepository: Repository<VacationRequest>
  ) {}

  

  async hasVacationRequestWithEmployeeId(employeeId: number): Promise<boolean> {
    try {
      const count = await this.vacationRequestRepository
        .createQueryBuilder('vacation_request')
        .where('vacation_request.employee_id = :employeeId', { employeeId })
        .getCount();

      return count > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async isEmployeeOnVacation(employeeId: number): Promise<boolean> {
    try {
      const count = await this.vacationRequestRepository
        .createQueryBuilder('vr') 
        .where('vr.employee_id = :employeeId', { employeeId })
        .andWhere('NOW() BETWEEN vr.start_date AND vr.end_date') 
        .getCount();

      return count > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}