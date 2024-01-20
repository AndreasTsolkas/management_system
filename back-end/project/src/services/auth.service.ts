import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

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
        const payload = { sub: employee.id, email: employee.email };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      }
      else throw new UnauthorizedException;
    }
    catch (error) {
      console.log(error);
      if(error instanceof BadRequestException)
        throw new BadRequestException('Δεν βρέθηκε ο χρήστης με το email: '+email+'.');
      else if(error instanceof UnauthorizedException) {
        let message = 'Ο κωδικός που δώσατε δεν είναι σωστός.';
        if(isEmployeeNotAccepted) message = 'Ο λογαριασμός με το email '+email+' υπάρχει αλλά δεν έχει γίνει αποδεκτός.';
        throw new UnauthorizedException(message);
      }
      else throw new InternalServerErrorException('Σφάλμα κατά την αναζήτηση του λογαριασμού.');
    }
  }

  async register(employee: Employee): Promise<Employee> {

    const hashedPassword = await bcrypt.hash(employee.password,bcryptSaltOrRounds)
    employee.password = hashedPassword;

    try{
      const newEmployee = await this.employeeService.create(employee);
      newEmployee.password = 'hidden';
      return newEmployee;
    } 
    catch(error) {
      let message = "Σφάλμα κατά τη δημιουργία νέου λογαριασμού.";
      if(error.code==23505) {
        message= "Το email που δώσατε χρησιμοποιείται από άλλον χρήστη.";
        throw new BadRequestException(message);
      }
      throw new InternalServerErrorException(message);
    }
  }

}