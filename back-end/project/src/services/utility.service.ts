import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';
import { Bonus } from 'src/entities/bonus.entity';



@Injectable()
export class UtilityService { 
  // I use this service to avoid circular dependencies between services (for example, employeeService uses bonusService while bonusService also uses employeeService)
  constructor(
    private readonly entityManager: EntityManager,
    @InjectRepository(VacationRequest)
    private vacationRequestRepository: Repository<VacationRequest>,
    @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>
  ) {}

  
 // Using Vacation Request repository
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
  
  async setVacationrequestToNullByDepartmentId(transactionalEntityManager: EntityManager, employeeId: number): Promise<void> {
    await transactionalEntityManager
      .createQueryBuilder()
      .update(VacationRequest)
      .set({ employee: null })
      .where('employee = :employeeId', { employeeId })
      .execute();
  }
  
  // Using Bonus repository
  async setBonusToNullByDepartmentId(transactionalEntityManager: EntityManager, employeeId: number): Promise<void> {
    await transactionalEntityManager
      .createQueryBuilder()
      .update(Bonus)
      .set({ employee: null })
      .where('employee = :employeeId', { employeeId })
      .execute();
  }

}