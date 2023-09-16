import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';

import * as Messages from 'src/messages';

@Injectable()
export class VacationRequestService {
  constructor(
    @InjectRepository(VacationRequest)
    private vacationRequestRepository: Repository<VacationRequest>,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.vacationRequestRepository.find({ relations: ['employee'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateVacationRequestTableError);
    }
    
  }

  async findOneWithRelationships(id: number): Promise<VacationRequest | null> {
    try {
      return this.vacationRequestRepository
      .createQueryBuilder('vacation_request')
      .leftJoinAndSelect('vacation_request.employee', 'employee') 
      .where('vacation_request.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateVacationRequestTableError);
    }
    
  }

  async create(vacationRequestData: Partial<VacationRequest>): Promise<VacationRequest> {
    try {
      const newVacationRequest = this.vacationRequestRepository.create(vacationRequestData);
      return this.vacationRequestRepository.save(newVacationRequest);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateVacationRequestTableError);
    }
  }

  async update(id: any, vrequestData: Partial<VacationRequest>): Promise<VacationRequest | null> {
    try {
      const vacationRequest = await this.vacationRequestRepository.findOne(id);
      if (!vacationRequest) {
        return null; 
      }
      Object.assign(vacationRequest, vrequestData);
      return this.vacationRequestRepository.save(vacationRequest);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateVacationRequestTableError);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.vacationRequestRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateVacationRequestTableError);
    }
    
  }
}