import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Employee } from 'src/entities/employee.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Employee])],
  exports: [TypeOrmModule]
})
export class EmployeeModule {}