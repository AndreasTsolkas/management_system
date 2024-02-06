import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards, Headers, BadRequestException, Post  } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Employee } from 'src/entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/services/profile.service';
import { TokenService } from 'src/services/token.service';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  
  constructor(private profileService: ProfileService,
    private readonly tokenService: TokenService
    ) {

  }

  @Get()
  async findOneWithRelationshipsAndSpecialDetails(@Headers('Authorization') authorization: string) {
    if (!authorization) return { message: 'Unauthorized' };
    const decodedToken =  this.tokenService.decodeToken(authorization);
    const userId: number  =  this.tokenService.extractField(decodedToken, 'id');
    if (userId !== undefined) {
      let basicData = await this.profileService.findOneWithRelationships(userId as number);
      let specialData = await this.profileService.getProfileSpecialDetails(userId as number);
      return {
        basicData, specialData
      }
    }
    else throw new BadRequestException('User id is missing.');
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() employeeData: Partial<Employee>) {
    return this.profileService.update(id, employeeData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.profileService.remove(id);
  }

  @Post('/checkpassword/:id')
  async checkIfPasswordIsCorrect(@Param('id') id: number, @Body('password') password: string) {
    return await this.profileService.checkIfPasswordIsCorrect(id, password);
  }

  @Patch('/updatepassword/:id')
  async updatePassword(@Param('id') id: number, @Body('newpassword') password: string) {
    return await this.profileService.updatePassword(id, password);
  }

  @Get('/amionvacation')
  async findOneWithRelationshipsAndCheckIfIsOnVacation(@Headers('Authorization') authorization: string) {
    if (!authorization) return { message: 'Unauthorized' };
    const decodedToken =  this.tokenService.decodeToken(authorization);
    const userId: number  =  this.tokenService.extractField(decodedToken, 'id');
    return await this.profileService.checkIfIAmOnVacation(userId);
  }
  
}