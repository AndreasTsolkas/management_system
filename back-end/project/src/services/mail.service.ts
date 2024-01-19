/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import * as handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as Important from 'src/important';

dotenv.config();

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendEmail(mailCase: number, adminMail?:string, project?: any): Promise<void> {

    let mailSubject: any = '';
    let mailToSend = "thisemail@gmail.com";
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
    }
    const compiledTemplate = handlebars.compile(template);
    const html = compiledTemplate({ Important, project });


    const imagePath = path.join(__dirname, '../../src', 'filmcluster_logo.png');
    const imageData = fs.readFileSync(imagePath);
    const imageCid = 'filmcluster_logo';

    await this.mailerService.sendMail({
      to: mailToSend,
      from: process.env.FROM,
      subject: mailSubject,
      html: html,
      template: template,
      attachments: [
        {
          filename: 'filmcluster_logo.png',
          content: imageData,
          cid: imageCid,
          contentDisposition: 'inline',
          contentType: 'image/png',
        },
      ],
    });

  }
}