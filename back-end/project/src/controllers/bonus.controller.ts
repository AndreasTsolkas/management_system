import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { Bonus } from 'src/entities/bonus.entity';
import { BonusService } from 'src/services/bonus.service';

@Controller('bonus')
export class BonusController {
  
  constructor(private bonusService: BonusService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    let x=1;
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
}