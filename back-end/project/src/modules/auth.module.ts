import { Module } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { UsersModule } from 'src/modules/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}