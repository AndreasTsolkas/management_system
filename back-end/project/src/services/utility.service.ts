import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';



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
        .andWhere('vr.status = :status', { status: 'approved' })
        .getCount();

      return count > 0;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async hasPendingRequest(employeeId: number): Promise<boolean> {
    const request = await this.vacationRequestRepository.findOne({
      where: { employee: { id: employeeId }, status: 'pending' },
    });

    return !!request;
  }
}