import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { MailerService } from '@nestjs-modules/mailer';

import { Employee } from "src/entities/employee.entity";
import { EmployeeService } from "src/services/employee.service";
import {bcryptSaltOrRounds} from "src/important";


@Injectable()
export class TokenService {
  constructor(
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}

  async decodeToken(authorization: string) {
    const token = authorization.replace('Bearer ', '');
    const decodedToken = this.jwtService.decode(token);
    return decodedToken;
  }

  async extractField(decodedToken: any, field: any) {
    let extractedField: any = decodedToken?.[field];
    return extractedField;
  }

}