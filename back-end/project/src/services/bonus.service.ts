import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from 'src/entities/bonus.entity';
import { SeasonBonus} from 'src/enums/season.bonus.enum';

import * as Messages from 'src/messages';

@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.bonusRepository.find({ relations: ['department', 'employee'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateBonusTableError);
    }
  }

  async findOneWithRelationships(id: number): Promise<Bonus | null> {
    try {
      return this.bonusRepository
      .createQueryBuilder('bonus')
      .leftJoinAndSelect('bonus.department', 'department')
      .leftJoinAndSelect('bonus.employee', 'employee') 
      .where('bonus.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateBonusTableError);
    }
  }

  async update(id: number, bonusData: Partial<Bonus>): Promise<Bonus | null> {
    try {
      const bonus = await this.bonusRepository.findOne({where: {id}});
      if (!bonus) {
        return null; 
      }
      Object.assign(bonus, bonusData);
      return this.bonusRepository.save(bonus);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateBonusTableError);
    }
  }

  async create(bonusData: Partial<Bonus>): Promise<Bonus> {
    try {
      const newBonus = this.bonusRepository.create(bonusData);
      return this.bonusRepository.save(newBonus);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateBonusTableError);
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.bonusRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException(Messages.updateBonusTableError);
    }
  }

  // 

  async calculateBonus(salary: number, season: string) {
    let result = 0;
    if(salary === undefined || season === undefined || !((season.toUpperCase()) in SeasonBonus))
      throw new BadRequestException();
    let seasonName = season.toUpperCase(); 
    let enumValue = SeasonBonus[seasonName];
    result += salary * enumValue;
    return result;
  }
}