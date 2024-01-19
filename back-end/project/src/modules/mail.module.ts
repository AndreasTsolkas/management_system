import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { MailService } from 'src/services/mail.service';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
        useFactory: () => ({
          transport: {
            host: process.env.HOST,
            secure: false,
            auth: {
              user: process.env.USER,
              pass: process.env.PASSWORD,
            },
          },
          defaults: {
            from: process.env.FROM,
          },
          preview: false,
          template: {
            dir: join(__dirname,  '/templates'), //
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
