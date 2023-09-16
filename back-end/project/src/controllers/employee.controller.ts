import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
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
}