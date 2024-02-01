import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { jwtConstants } from 'src/constant';
import { EmployeeModule } from 'src/modules/employee.module';
import * as Important from 'src/important';

@Module({
  imports: [
    EmployeeModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: Important.jwtExpiresIn },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}