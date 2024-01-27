import { Module } from '@nestjs/common';
import { VacationRequestModule } from 'src/modules/vacation_request.module'; 
import { BonusModule } from 'src/modules/bonus.module'; 
import { UtilityService } from 'src/services/utility.service';

@Module({
  imports: [VacationRequestModule, BonusModule],
  providers: [UtilityService], 
  exports: [UtilityService],
})
export class UtilityModule {}