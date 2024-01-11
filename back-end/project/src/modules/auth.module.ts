import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { UsersService } from 'src/services/users.service';

@Module({
  providers: [AuthService, UsersService],
  exports: [AuthService],
})
export class AuthModule {}