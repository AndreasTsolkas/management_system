import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { SeasonBonus} from 'src/enums/season.bonus.enum';

import * as Messages from 'src/messages';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.userRepository.find({ relations: ['employee', 'employee.department'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<User | null> {
    try {
      return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.employee', 'employee') 
      .leftJoinAndSelect('employee.department', 'department')
      .where('user.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User | null> {
    try {
      const user = await this.userRepository.findOne({where: {id}});
      if (!user) {
        return null; 
      }
      Object.assign(user, userData);
      return this.userRepository.save(user);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async create(userData: Partial<User>): Promise<User> {
    try {
      const newUser = this.userRepository.create(userData);
      return this.userRepository.save(newUser);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.userRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  
}