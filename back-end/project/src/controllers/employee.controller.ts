import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from '@nestjs/common';
import { Employee } from 'src/entities/employee.entity';
import { EmployeeService } from 'src/services/employee.service';

@Controller('employee')
export class EmployeeController {
  
  constructor(private employeeService: EmployeeService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    return await this.employeeService.findAllWithRelationships();
  }

  @Get('/all/condition')
  async findAllWithRelationshipsAndCondition(@Query('field') field: string,
  @Query('value') value: string) {
    return await this.employeeService.findAllWithRelationshipsWithNullCondition(field, value);
  }

  @Get('/:id')
  async findOneWithRelationships(@Param('id') id: any) {
    return await this.employeeService.findOneWithRelationships(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() employeeData: Partial<Employee>, @Req() request: Request) {
    return this.employeeService.update(id, employeeData);
  }

  @Put()
  async create(@Body() employeeData: Partial<Employee>, @Req() request: Request) {
    return this.employeeService.create(employeeData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.employeeService.remove(id);
  }

  @Get('/dexist/:id')
  async countIfDepartmentIdExistence(@Param('id') id: number) {
    return await this.employeeService.countDepartmentExistenceInEmployee(id);
  }

  ///

  @Get('/all/vrequest/avaliable')
  async getAllUsersAvaliableForVacationRequest(): Promise<Employee[]> {
    return await this.employeeService.getEmployeesAvailableForVacation();
  }

  @Get('/isonvacation/:id')
  async findOneWithRelationshipsAndCheckIfIsOnVacation(@Param('id') id: number) {
    return await this.employeeService.findOneWithRelationshipsAndCheckIfIsOnVacation(id);
  }
}