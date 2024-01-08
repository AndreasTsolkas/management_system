import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { VacationRequestService } from './vacation_request.service';



@Injectable()
export class ScheduledTasksService {

  constructor(
    private readonly vacationRequestService: VacationRequestService
  ) {}
  
  @Cron('0 0 * * *') 
  handleCron() {
    return this.vacationRequestService.updatePendingRequests();
  }
}