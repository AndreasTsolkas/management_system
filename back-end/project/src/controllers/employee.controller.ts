import { Body, Controller, Delete, Get, Param, ParseBoolPipe, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Employee } from 'src/entities/employee.entity';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles.decorator';
import { RolesGuard } from 'src/roles.guard';
import { EvaluateRegistrationRequest } from 'src/dto/evaluate.registration.request.dto';
import { EmployeeService } from 'src/services/employee.service';

@UseGuards(RolesGuard, AuthGuard)
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

  @Roles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() employeeData: Partial<Employee>, @Req() request: Request) {
    return this.employeeService.update(id, employeeData);
  }

  @Put()
  async create(@Body() employeeData: Partial<Employee>, @Req() request: Request) {
    return this.employeeService.create(employeeData);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.employeeService.nulifyEmployeeBonusesAndVrequestsAndRemove(id);
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

  @Get('/only/byisaccepted')
  async findBystatus(@Query('isAccepted', ParseBoolPipe) isAccepted: boolean) {
    return await this.employeeService.findEmployeesWhoAreAccepted(isAccepted);
  }

  @Roles(Role.Admin)
  @Put('/evaluate/regitsrtionrequest')
  async evaluateVacationRequest(@Body() evaluateRegistrationRequest: EvaluateRegistrationRequest, 
  @Req() request: Request) {
    return await this.employeeService.evaluateRegistrationRequest
    (evaluateRegistrationRequest.employeeId, evaluateRegistrationRequest.approved);
  }

  

}