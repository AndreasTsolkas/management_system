import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { EmployeeToProject } from 'src/entities/employee_to_project.entity';
import { EmployeeToProjectService } from 'src/services/employee_to_project.service';

@Controller('employee_to_project')
export class EmployeeToProjectController {
  
  constructor(private employeeToProjectService: EmployeeToProjectService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    return await this.employeeToProjectService.findAllWithRelationships();
  }

  @Get('/:id')
  async findOneWithRelationships(@Param('id') id: any) {
    return await this.employeeToProjectService.findOneWithRelationships(id);
  }


  @Put()
  async create(@Body() employeeToProjectData: Partial<EmployeeToProject>, @Req() request: Request) {
    return this.employeeToProjectService.create(employeeToProjectData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.employeeToProjectService.remove(id);
  }
}