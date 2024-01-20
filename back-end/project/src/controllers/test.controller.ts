import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from '@nestjs/common';
import { MailService } from 'src/services/mail.service';

@Controller('test')
export class TestController {
  
  constructor(private mailService: MailService) {

  }

  @Get('/sendmail')
  async sendMail() {
    return await this.mailService.sendEmail(1);
  }


}