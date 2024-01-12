import { Module } from '@nestjs/common';
import { VacationRequestModule } from 'src/modules/vacation_request.module'; 
import { UtilityService } from 'src/services/utility.service';

@Module({
  imports: [VacationRequestModule],
  providers: [UtilityService], 
  exports: [UtilityService],
})
export class UtilityModule {}