import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VacationRequest } from 'src/entities/vacation_request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VacationRequest])],
  exports: [TypeOrmModule]
})
export class VacationRequestModule {}