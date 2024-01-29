import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards, Headers, BadRequestException  } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Employee } from 'src/entities/employee.entity';
import { Role } from 'src/enums/role.enum';
import { Roles } from 'src/roles.decorator';
import { JwtService } from '@nestjs/jwt';
import { RolesGuard } from 'src/roles.guard';
import { ProfileService } from 'src/services/profile.service';
import { EmployeeService } from 'src/services/employee.service';

@UseGuards(RolesGuard, AuthGuard)
@Controller('profile')
export class ProfileController {
  
  constructor(private employeeService: EmployeeService,
    private readonly jwtService: JwtService) {

  }

  @Get()
  async findOneWithRelationships(@Headers('Authorization') authorization: string) {
    if (!authorization) return { message: 'Unauthorized' };
    const token = authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);
    const userId = decodedToken?.id;
    if (userId !== undefined) 
      return await this.employeeService.findOneWithRelationships(userId);
    else throw new BadRequestException('User id is missing.');
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
    return this.employeeService.nulifyEmployeeBonusesAndVrequestsAndRemove(id);
  }
  
}