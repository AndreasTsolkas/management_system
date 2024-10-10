import { Body, Controller, Delete, Get, Param, Patch, Put, Req, UseGuards } from '@nestjs/common';
import { Department } from 'src/entities/department.entity';
import { DepartmentService } from 'src/services/department.service';
import { EmployeeService } from 'src/services/employee.service';
import { GetAllDepartmentsSpecial } from 'src/dto/get.all.departments.special.dto';
import { GetDepartmentsSpecial } from 'src/dto/get.department.special.dto';
import { RolesGuard } from 'src/roles.guard';
import { AuthGuard } from 'src/auth.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(RolesGuard, AuthGuard)
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

  @Roles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() departmentData: Partial<Department>) {
    return this.departmentService.update(id, departmentData);
  }

  @Roles(Role.Admin)
  @Put()
  async create(@Body() departmentData: Partial<Department>) {
    return this.departmentService.create(departmentData);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.departmentService.setEmployeesOutOfThisDepartmentAndRemove(id);
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
  async findOneAndCountDepartmentIdToEmployee(@Param('id') id: number) {
    let result = new GetDepartmentsSpecial();
    result.departmentEntityData = await this.departmentService.findOne(id);
    const {count, employees} = await this.employeeService.countDepartmentExistenceInEmployee(id)
    result.employeesNum = count;
    result.employees = employees;
    return result;
  }
  
}