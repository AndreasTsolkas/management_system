/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as Important from 'src/important';
import { Employee } from 'src/entities/employee.entity';


dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(employee: Employee, mailCase: number, departmentName?:string, bonusId?: number, vacationRequestId?: number): Promise<void> {

    let mailSubject: any = '';
    let mailToSend = employee.email;
    let template: any;

    switch(mailCase) {
      case 1:
        mailSubject ="Thank you for the registration";
        template =  fs.readFileSync('./src/templates/registration-request-confirmation.hbs', 'utf8');
        break;
      case 2:
        mailSubject ="New employee registered";
        template =  fs.readFileSync('./src/templates/new-employee-registered.hbs', 'utf8');
        break;
      case 3:
        mailSubject ="Congratulations! You recieved a new leave request";
        template =  fs.readFileSync('./src/templates/leave-recieved.hbs', 'utf8');
        break;
      case 4:
        mailSubject ="Congratulations! Your registration request has been accepted";
        template =  fs.readFileSync('./src/templates/enabled-reg-request.hbs', 'utf8');
        break;
      case 5:
        mailSubject ="Your registration request has been rejected";
        template =  fs.readFileSync('./src/templates/disabled-reg-request.hbs', 'utf8');
        break;
      case 6:
        mailSubject ="We have just received your vacation request";
        template =  fs.readFileSync('./src/templates/vacation-request-confirmation.hbs', 'utf8');
        break;
      case 7:
        mailSubject ="Congratulations! Your leave request has been accepted";
        template =  fs.readFileSync('./src/templates/enabled-vac-request.hbs', 'utf8');
        break;
      case 8:
        mailSubject ="Your leave request has been rejected";
        template =  fs.readFileSync('./src/templates/disabled-vac-request.hbs', 'utf8');
        break;
      case 9:
        mailSubject ="Congratulations! You recieved a new bonus";
        template =  fs.readFileSync('./src/templates/bonus-recieved.hbs', 'utf8');
        break;
      case 10:
        mailSubject ="You just got out of the department you were in";
        template =  fs.readFileSync('./src/templates/removed-from-department.hbs', 'utf8');
        break;
      case 11:
        mailSubject ="You have just been added to a new department";
        template =  fs.readFileSync('./src/templates/added-on-department.hbs', 'utf8');
        break;
      case 12:
        mailSubject ="You have been selected to be an administrator";
        template =  fs.readFileSync('./src/templates/became-admin.hbs', 'utf8');
        break;
      case 13:
        mailSubject ="You are not an administrator anymore";
        template =  fs.readFileSync('./src/templates/is-not-admin-anymore.hbs', 'utf8');
        break;
    }
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ employee, Important, departmentName, bonusId, vacationRequestId });

    console.log(html);
    /*await this.mailerService.sendMail({
      to: mailToSend,
      from: process.env.MAIL_USER,
      subject: mailSubject,
      html: html,
      template: template,
    });*/

  }
}