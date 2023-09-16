import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { VacationRequest } from 'src/entities/vacation_request.entity';
import { VacationRequestService } from 'src/services/vacation_request.service';

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

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() vacationRequestData: Partial<VacationRequest>, @Req() request: Request) {
    return this.vacationRequestService.update(id, vacationRequestData);
  }

  @Put()
  async create(@Body() vacationRequestData: Partial<VacationRequest>, @Req() request: Request) {
    return this.vacationRequestService.create(vacationRequestData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.vacationRequestService.remove(id);
  }
}