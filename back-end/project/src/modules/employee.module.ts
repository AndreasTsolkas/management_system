import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeService } from 'src/services/employee.service';
import { UtilityModule } from './utility.module'; // Import UtilityModule

@Module({
  imports: [TypeOrmModule.forFeature([Employee]), UtilityModule], // Import UtilityModule
  providers: [EmployeeService],
  exports: [EmployeeService, TypeOrmModule],
})
export class EmployeeModule {}