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
        mailSubject ="Σας ευχαριστούμε για την εγγραφή σας";
        template =  fs.readFileSync('./src/templates/thank-you.hbs', 'utf8');
        break;
      case 2:
        mailSubject ="Νέος χρήστης έκανε αίτημα εγγραφής";
        template =  fs.readFileSync('./src/templates/new-user-registered.hbs', 'utf8');
        mailToSend = adminMail;
        break;
      case 3:
        mailSubject ="Συχαρητηρία! Το αίτημά σας έγινε αποδεκτό";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 4:
        mailSubject ="Μόλις λάβαμε την αίτηση άδειας που υποβάλλατε";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 5:
        mailSubject ="Συχαρητηρία! Η αίτηση άδειας έγινε αποδεκτή";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 6:
        mailSubject ="Συχαρητηρία! Πήρατε νέο bonus";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 7:
        mailSubject ="Μόλις βγήκατε εκτός από το τμήμα που ήσασταν";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
      case 7:
        mailSubject ="Μόλις βγήκατε προστεθήκατε σε νέο τμήμα";
        template =  fs.readFileSync('./src/templates/enabled-confirmation.hbs', 'utf8');
        break;
    }
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ Important, project });

    await this.mailerService.sendMail({
      to: mailToSend,
      from: process.env.FROM,
      subject: mailSubject,
      html: html,
      template: template,
    });

  }
}