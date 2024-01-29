import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Bonus } from 'src/entities/bonus.entity';
import { CreateBonus } from 'src/dto/create.bonus.dto';
import { BonusService } from 'src/services/bonus.service';
import { AuthGuard } from 'src/auth.guard';
import { RolesGuard } from 'src/roles.guard';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/enums/role.enum';

@UseGuards(RolesGuard, AuthGuard)
@Controller('bonus')
export class BonusController {
  
  constructor(private bonusService: BonusService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    return await this.bonusService.findAllWithRelationships();
  }

  @Get('/:id')
  async findOneWithRelationships(@Param('id') id: any) {
    return await this.bonusService.findOneWithRelationships(id);
  }

  @Roles(Role.Admin)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() bonusData: Partial<Bonus>, @Req() request: Request) {
    return this.bonusService.update(id, bonusData);
  }

  @Roles(Role.Admin)
  @Put()
  async create(@Body() bonusData: Partial<Bonus>, @Req() request: Request) {
    return this.bonusService.create(bonusData);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.bonusService.remove(id);
  }

  // 

  @Roles(Role.Admin)
  @Put('/create/bonus')
  async createNewBonus(@Body() createBonusData: CreateBonus, @Req() request: Request) {
    return this.bonusService.createNewBonus(createBonusData);
  }

  @Roles(Role.Admin)
  @Get('/calculate/:salary/:season')
  async calculateSalaryAfterBonus(@Param('salary') salary: number, @Param('season') season: string,
  @Req() request: Request) {
    const {newSalary, bonusRate} = await this.bonusService.calculateSalaryAfterBonus(salary,season);
    return {
      newSalary, bonusRate
    };
  }


  

}