import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Get } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Employee } from 'src/entities/employee.entity';
import { AuthService } from 'src/services/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
  
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signIn(@Body() signInDto: Record<string, any>) {
      return this.authService.signIn(signInDto.email, signInDto.password);
    }

    @HttpCode(HttpStatus.OK)
    @Post('register')
    register(@Body() employee: Employee) {
      return this.authService.register(employee);
    }
  
    @UseGuards(AuthGuard)
    @Get('profile')
    getProfile(/*@Request() req*/) {
      return /*req.user*/ 1;
    }
  }