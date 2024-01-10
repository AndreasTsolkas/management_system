import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

import { VacationRequestService } from './vacation_request.service';



@Injectable()
export class ScheduledTasksService {

  constructor(
    private readonly vacationRequestService: VacationRequestService
  ) {}
  
  @Cron('0 0 * * *') 
  executeEveryMidnight() {
    return this.vacationRequestService.handleOutdatedPendingRequests();
  }
}