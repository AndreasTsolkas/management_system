/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as Important from 'src/important';

dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(mailCase: number, adminMail?:string, project?: any): Promise<void> {

    let mailSubject: any = '';
    let mailToSend = "tsolkasadreas@gmail.com";
    let template: any = fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
    switch(mailCase) {
      case 1:
        mailSubject ="Thank you for the registration";
        template =  fs.readFileSync('./src/templates/thank-you.hbs', 'utf8');
        break;
      case 2:
        mailSubject ="New employee registered";
        template =  fs.readFileSync('./src/templates/new-user-registered.hbs', 'utf8');
        mailToSend = adminMail;
        break;
      case 3:
        mailSubject ="Congratulations! Your registration request has been accepted";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 4:
        mailSubject ="We have just received your vacation request";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 5:
        mailSubject ="Congratulations! Your vacation request has been accepted";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 6:
        mailSubject ="Congratulations! You recieved a new bonus";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 7:
        mailSubject ="You just got out of the department you were in";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 7:
        mailSubject ="You have just been added to a new department";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
    }
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ Important, project });

    console.log("here");
    await this.mailerService.sendMail({
      to: mailToSend,
      from: process.env.MAIL_USER,
      subject: mailSubject,
      html: html,
      template: template,
    });

  }
}