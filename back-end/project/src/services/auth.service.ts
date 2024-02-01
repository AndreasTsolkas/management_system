import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';

import { Employee } from "src/entities/employee.entity";
import { EmployeeService } from "src/services/employee.service";
import {bcryptSaltOrRounds} from "src/important";


@Injectable()
export class AuthService {
  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}

  async signIn(email, pass, isEmployeeNotAccepted: boolean | null = null) { 
    try {
      const employee = await this.employeeService.findOneWithRelationshipsBySpecificFieldAndValue("email",email);

      if (!employee) 
        throw new BadRequestException;
  

      const isValid =  await bcrypt.compare(pass, employee.password);
      if(isValid) {
        if(!employee.isAccepted) {
          isEmployeeNotAccepted = true;
          throw new UnauthorizedException;
        }
        const payload = { id: employee.id, email: employee.email };
        const admin = employee.isAdmin;
        return {
          access_token: await this.jwtService.signAsync(payload), admin
        };
      }
      else throw new UnauthorizedException;
    }
    catch (error) {
      console.log(error);
      if(error instanceof BadRequestException)
        throw new BadRequestException('Employee with the email : '+email+' not found.');
      else if(error instanceof UnauthorizedException) {
        let message = 'Password given is incorrect.';
        if(isEmployeeNotAccepted) message = 'The account with the email '+email+' exists but has not yet benn accepted.';
        throw new UnauthorizedException(message);
      }
      else throw new InternalServerErrorException('Account search failed.');
    }
  }

  async register(employee: Employee): Promise<Employee> {

    const hashedPassword = await bcrypt.hash(employee.password,bcryptSaltOrRounds);
    employee.password = hashedPassword;

    try{
      const newEmployee = await this.employeeService.create(employee);
      newEmployee.password = 'hidden';
      return newEmployee;
    } 
    catch(error) {
      let message = "New account creation failed.";
      if(error.code==23505) {
        message= "Email given is used by another employee.";
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(message);
    }
  }

}