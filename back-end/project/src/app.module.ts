import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';

import * as dotenv from 'dotenv';

import { Employee } from 'src/entities/employee.entity';
import { Department } from 'src/entities/department.entity';
import { Bonus } from 'src/entities/bonus.entity';
import { VacationRequest } from 'src/entities/vacation_request.entity';

import { EmployeeService } from 'src/services/employee.service';
import { DepartmentService } from 'src/services/department.service';
import { BonusService } from 'src/services/bonus.service';
import { VacationRequestService } from 'src/services/vacation_request.service';
import { DatabaseService } from 'src/services/database.service';
import { UtilityService } from 'src/services/utility.service';
import { ScheduledTasksService } from 'src/services/scheduled.tasks.service';


import { EmployeeModule } from 'src/modules/employee.module';
import { DepartmentModule } from 'src/modules/department.module';
import { BonusModule } from 'src/modules/bonus.module';
import { VacationRequestModule } from 'src/modules/vacation_request.module';

import { EmployeeController } from 'src/controllers/employee.controller';
import { DepartmentController } from 'src/controllers/department.controller';
import { BonusController } from 'src/controllers/bonus.controller';
import { VacationRequestController } from 'src/controllers/vacation_request.controller';


dotenv.config();
@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', 
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [Employee, Department, Bonus, VacationRequest],
      synchronize: false,
    }),
    
    EmployeeModule, DepartmentModule, BonusModule, VacationRequestModule],
  controllers: [AppController, EmployeeController, DepartmentController, BonusController, 
    VacationRequestController],
  providers: [AppService, EmployeeService, DepartmentService, BonusService, VacationRequestService, 
    DatabaseService, UtilityService, ScheduledTasksService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
