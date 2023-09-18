import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from 'src/entities/project.entity';
import { SeasonBonus} from 'src/enums/season.bonus.enum';

import * as Messages from 'src/messages';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll() {
    try {
      return await this.projectRepository.find();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: any): Promise<Project | null> {
    try {
      return await this.projectRepository.findOneBy({ id });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, projectData: Partial<Project>): Promise<Project | null> {
    try {
      const project = await this.projectRepository.findOne({where: {id}});
      if (!project) {
        return null; 
      }
      Object.assign(project, projectData);
      return this.projectRepository.save(project);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(projectData: Partial<Project>): Promise<Project> {
    try {
      const newProject = this.projectRepository.create(projectData);
      return this.projectRepository.save(newProject);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.projectRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  
}