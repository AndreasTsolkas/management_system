import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from 'src/services/mail.service';
import { join } from 'path';
import * as dotenv from 'dotenv';

dotenv.config();
@Module({
  imports: [
    MailerModule.forRootAsync({
        useFactory: () => ({
          transport: {
            service: 'gmail',
            secure: true,
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASSWORD,
            },
          },
          defaults: {
            from: process.env.MAIL_USER,
          },
          preview: false,
          template: {
            dir: join(__dirname, '/templates'),
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
          },
        }),
      }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
