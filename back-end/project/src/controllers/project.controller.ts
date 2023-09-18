import { Body, Controller, Delete, Get, Param, Patch, Put, Req } from '@nestjs/common';
import { Project } from 'src/entities/project.entity';
import { ProjectService } from 'src/services/project.service';

@Controller('project')
export class  ProjectController {
  
  constructor(private projectService: ProjectService) {

  }
  @Get('/all')
  async findAll() {
    return await this.projectService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: any) {
    return await this.projectService.findOne(id);
  }

  @Patch('/:id')
  async update(@Param('id') id: number, @Body() projectData: Partial<Project>, @Req() request: Request) {
    return this.projectService.update(id, projectData);
  }

  @Put()
  async create(@Body() projectData: Partial<Project>, @Req() request: Request) {
    return this.projectService.create(projectData);
  }

  @Delete('/:id')
  async remove(@Param('id') id: number) {
    return this.projectService.remove(id);
  }
}