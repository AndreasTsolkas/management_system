import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from '@nestjs/common';
import { Employee } from 'src/entities/employee.entity';
import { MailService } from 'src/services/mail.service';

@Controller('test')
export class TestController {
  
  constructor(private mailService: MailService) {

  }

  @Get('/sendmail')
  async sendMail() {
    let employee: Employee = new Employee();
    employee.email='thismail@gmail.com';
    return await this.mailService.sendEmail(employee, 8,'engineering',2);
  }


}