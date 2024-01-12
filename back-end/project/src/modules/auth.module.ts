import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from 'src/modules/users.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controllers/auth.controller';
import { jwtConstants } from 'src/constant';
import { EmployeeModule } from 'src/modules/employee.module';

@Module({
  imports: [
    UsersModule,
    EmployeeModule, 
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}