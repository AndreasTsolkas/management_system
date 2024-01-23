import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req, UseGuards } from '@nestjs/common';
import { Bonus } from 'src/entities/bonus.entity';
import { CreateBonus } from 'src/dto/createBonus.dto';
import { BonusService } from 'src/services/bonus.service';
import { AuthGuard } from 'src/auth.guard';
import { RolesGuard } from 'src/roles.guard';


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

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() bonusData: Partial<Bonus>, @Req() request: Request) {
    return this.bonusService.update(id, bonusData);
  }

  @Put()
  async create(@Body() bonusData: Partial<Bonus>, @Req() request: Request) {
    return this.bonusService.create(bonusData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.bonusService.remove(id);
  }

  // 

  @Put('/create/bonus')
  async createNewBonus(@Body() createBonusData: CreateBonus, @Req() request: Request) {
    return this.bonusService.createNewBonus(createBonusData);
  }

  @Get('/calculate/:salary/:season')
  async calculateSalaryAfterBonus(@Param('salary') salary: number, @Param('season') season: string,
  @Req() request: Request) {
    const {newSalary, bonusRate} = await this.bonusService.calculateSalaryAfterBonus(salary,season);
    return {
      newSalary, bonusRate
    };
  }


  

}