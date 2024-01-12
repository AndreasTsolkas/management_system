import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Bonus } from 'src/entities/bonus.entity';
import { EmployeeService } from 'src/services/employee.service';
import { CreateBonus } from 'src/dto/createBonus.dto';
import { SeasonBonus} from 'src/enums/season.bonus.enum';


@Injectable()
export class BonusService {
  constructor(
    @InjectRepository(Bonus)
    private bonusRepository: Repository<Bonus>,
    private employeeService: EmployeeService
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.bonusRepository.find({ relations: ['employee', 'employee.department'] });
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<Bonus | null> {
    try {
      return this.bonusRepository
      .createQueryBuilder('bonus')
      .leftJoinAndSelect('bonus.employee', 'employee') 
      .leftJoinAndSelect('employee.department', 'department')
      .where('bonus.id = :id', { id })
      .getOne();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
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
      throw new InternalServerErrorException();
    }
  }

  async create(bonusData: Partial<Bonus>): Promise<Bonus> {
    try {
      const newBonus = this.bonusRepository.create(bonusData);
      return this.bonusRepository.save(newBonus);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async remove(id: number): Promise<void> {
    try {
      await this.bonusRepository.delete(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  

  // 

  async calculateSalaryAfterBonus(salary: number, season: string) {
    try {
      let enumValue = SeasonBonus[season.toUpperCase()];
      let bonusAmount = salary * enumValue;
      let newSalary = salary +++ bonusAmount;
      return {
        newSalary: newSalary,
        bonusRate: enumValue,
        bonusAmount: bonusAmount
      };
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async createNewBonus(createBonusData: CreateBonus) {
    let result: any=null;
    let employee = await this.employeeService.findOneWithRelationships(createBonusData.employeeId);
    let salary = employee.salary;
    let season = createBonusData.season;
    if(salary === undefined || season === undefined || !((season.toUpperCase()) in SeasonBonus))
      throw new BadRequestException();
    try {
      let {newSalary, bonusAmount} = await this.calculateSalaryAfterBonus(salary, season);
      const currentTimestamp = new Date(new Date().getTime());
      result = await this.create({employee: employee, amount: bonusAmount, dateGiven: currentTimestamp});
      await this.employeeService.update(createBonusData.employeeId, {salary: newSalary});
      return result;
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  

  
}