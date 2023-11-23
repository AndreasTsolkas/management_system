import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { Department } from 'src/entities/department.entity';
import { DepartmentService } from 'src/services/department.service';
import { EmployeeService } from 'src/services/employee.service';
import { GetAllDepartmentsSpecial } from 'src/dto/getAllDepartmentsSpecial.dto';
import { GetDepartmentsSpecial } from 'src/dto/getDepartmentSpecial.dto';


@Controller('department')
export class  DepartmentController {
  
  constructor(private departmentService: DepartmentService,
    private employeeService: EmployeeService) {

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


  @Get('/all/countonuser')
  async findAllAndCountDepartmentIdToEmployee() {
    let result: GetAllDepartmentsSpecial[] = [];
    const allDepartmentsData = await this.departmentService.findAll();
    
    for (const item of allDepartmentsData) {
      let {count} = await this.employeeService.countDepartmentExistenceInEmployee(item.id);
      let departmentItem = new GetAllDepartmentsSpecial();
      departmentItem.departmentEntityData = item;
      departmentItem.employeesNum = count;
      result.push(departmentItem);
    }
    
    return result;
  } 

  @Get('/countonuser/:id')
  async findOneAndCountDepartmentIdToEmployee(@Param('id') id: any) {
    let result = new GetDepartmentsSpecial();
    result.departmentEntityData = await this.departmentService.findOne(id);
    const {count, employees} = await this.employeeService.countDepartmentExistenceInEmployee(id)
    result.employeesNum = count;
    result.employees = employees;
    return result;
  }
  
}