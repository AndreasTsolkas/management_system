import { Body, Controller, Delete, Get, Param, Patch, Put, Query, Req } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';

@Controller('user')
export class UserController {
  
  constructor(private userService: UserService) {

  }
  @Get('/all')
  async findAllWithRelationships() {
    return await this.userService.findAllWithRelationships();
  }

  @Get('/:id')
  async findOneWithRelationships(@Param('id') id: any) {
    return await this.userService.findOneWithRelationships(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() userData: Partial<User>, @Req() request: Request) {
    return this.userService.update(id, userData);
  }

  @Put()
  async create(@Body() userData: Partial<User>, @Req() request: Request) {
    return this.userService.create(userData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }

  

}