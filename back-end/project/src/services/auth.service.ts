import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "src/services/users.service";
import { EmployeeService } from "src/services/employee.service";


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private employeeService: EmployeeService,
    private jwtService: JwtService
  ) {}

  async signIn(email, pass) {
    const employee = await this.employeeService.findOneWithRelationshipsBySpecificFieldAndValue("email",email);
    if (employee?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: employee.id, email: employee.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}