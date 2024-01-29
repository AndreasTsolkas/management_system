import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards, Headers, BadRequestException  } from '@nestjs/common';
import { AuthGuard } from 'src/auth.guard';
import { Employee } from 'src/entities/employee.entity';
import { JwtService } from '@nestjs/jwt';
import { ProfileService } from 'src/services/profile.service';
import { TokenDecoderService } from 'src/services/token.decoder.service';

@UseGuards(AuthGuard)
@Controller('profile')
export class ProfileController {
  
  constructor(private profileService: ProfileService,
    private readonly tokenDecoderService: TokenDecoderService
    ) {

  }

  @Get()
  async findOneWithRelationshipsAndSpecialDetails(@Headers('Authorization') authorization: string) {
    if (!authorization) return { message: 'Unauthorized' };
    const decodedToken = await this.tokenDecoderService.decodeToken(authorization);
    const userId: number  = await this.tokenDecoderService.extractField(decodedToken, 'id');
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
  async update(@Param('id') id: number, @Body() employeeData: Partial<Employee>, @Req() request: Request) {
    return this.profileService.update(id, employeeData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.profileService.remove(id);
  }
  
}