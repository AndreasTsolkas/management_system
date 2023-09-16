import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { Department } from 'src/entities/department.entity';
import { DepartmentService } from 'src/services/department.service';

@Controller('department')
export class  DepartmentController {
  
  constructor(private departmentService: DepartmentService) {

  }
  @Get('/all')
  async findAll() {
    return await this.departmentService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: any) {
    return await this.departmentService.findOne(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() departmentData: Partial<Department>, @Req() request: Request) {
    return this.departmentService.update(id, departmentData);
  }

  @Put()
  async create(@Body() departmentData: Partial<Department>, @Req() request: Request) {
    return this.departmentService.create(departmentData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.departmentService.remove(id);
  }
}