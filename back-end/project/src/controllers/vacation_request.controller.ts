import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { VacationRequest } from 'src/entities/vacation_request.entity';
import { VacationRequestService } from 'src/services/vacation_request.service';

import { CreateVacationRequest } from 'src/dto/createVacationRequest.dto';
import { EvaluateVacationRequest } from 'src/dto/evaluateVacationRequest.dto';
import { RolesGuard } from 'src/roles.guard';
import { AuthGuard } from 'src/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(RolesGuard, AuthGuard)
@Controller('vrequest')
export class VacationRequestController {
  
  constructor(private vacationRequestService: VacationRequestService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    let x;
    return await this.vacationRequestService.findAllWithRelationships();
  }

  @Get('/:id')
  async findOneWithRelationships(@Param('id') id: any) {
    return await this.vacationRequestService.findOneWithRelationships(id);
  }

  @Roles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() vacationRequestData: Partial<VacationRequest>, 
  @Req() request: Request) {
    return this.vacationRequestService.update(id, vacationRequestData);
  }

  @Roles(Role.Admin)
  @Put()
  async create(@Body() vacationRequestData: Partial<VacationRequest>, 
  @Req() request: Request) {
    return this.vacationRequestService.create(vacationRequestData);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.vacationRequestService.remove(id);
  }

  // 
  @Get('/by/status')
  async findBystatus(@Query('status') status: string) {
    return await this.vacationRequestService.findByStatus(status);
  }

  @Put('/usercreate/vrequest')
  async userCreateVacation(@Body() createVacationRequestData: CreateVacationRequest, 
  @Req() request: Request) {
    return this.vacationRequestService.userCreateVacationRequest(createVacationRequestData);
  }

  @Roles(Role.Admin)
  @Put('/admincreate/vrequest')
  async adminCreateVacation(@Body() createVacationRequestData: CreateVacationRequest, 
  @Req() request: Request) {
    return this.vacationRequestService.adminCreateVacationRequest(createVacationRequestData);
  }

  @Roles(Role.Admin)
  @Put('/evaluate/vrequest')
  async evaluateVacationRequest(@Body() evaluateVacationRequest: EvaluateVacationRequest, 
  @Req() request: Request) {
    return this.vacationRequestService.evaluateVacationRequest
    (evaluateVacationRequest.vacationRequestId, evaluateVacationRequest.approved);
  }
  
  @Get('/hasemployeeId/:id')
  async hasVacationRequestWithEmployeeId(@Param('id') employeeId: number) {
    return this.vacationRequestService.hasVacationRequestWithEmployeeId(employeeId);
  }

}