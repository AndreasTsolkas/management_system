import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Not, Repository, getManager } from 'typeorm';
import { Employee } from 'src/entities/employee.entity';
import { ProfileSpecialDetails } from 'src/dto/profile.special.details';
import { EmployeeService } from './employee.service';
import { BonusService } from './bonus.service';
import { VacationRequestService } from './vacation_request.service';
import { UtilityService } from './utility.service';


@Injectable()
export class ProfileService {

  constructor(
    private readonly entityManager: EntityManager,
    private readonly employeeService: EmployeeService,
    private readonly bonusService: BonusService,
    private readonly vacationRequestService: VacationRequestService,
    private readonly utilityService: UtilityService,
  ) {}

  async findAllWithRelationships() {
    try {
      return await this.employeeService.findAllWithRelationships();
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }


  async findAllWithRelationshipsWithNullCondition(field: string, value: string) {
    try {
      return await this.employeeService.findAllWithRelationshipsWithNullCondition(field, value);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async findOneWithRelationships(id: number): Promise<Employee | null> {
    try {
      return this.employeeService.findOneWithRelationships(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
    
  }

  async findOneWithRelationshipsBySpecificFieldAndValue(field: string, value: any): Promise<Employee | null> {
    try {
      return this.employeeService.findOneWithRelationshipsBySpecificFieldAndValue(field, value);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, employeeData: Partial<Employee>): Promise<Employee | null> {
    try {
        return this.employeeService.update(id, employeeData);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<void> {
    try {
      await this.employeeService.nulifyEmployeeBonusesAndVrequestsAndRemove(id);
    }
    catch(error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }

  //

  async getBonusTotalNum(id: number) {
    return this.bonusService.getBonusNumByEmployeeId(id);
  }

  async getLeavesTotalNum(id: number) {
    return this.vacationRequestService.getApprovedVacationRequestsNumByEmployeeId(id);
  }

  async getLastBonusGiven(id: number) {
    return this.bonusService.getLastBonusByEmployeeId(id);
  }

  async getLastLeaveTaken(id: number) {
    return this.vacationRequestService.getLastVacationRequestByEmployeeId(id);
  }

  async checkIfIsOnLeave(id: number) {
    return this.utilityService.isEmployeeOnVacation(id);
  }

  async checkIfHasAnyVacationRequestPending(id: number) {
    return this.utilityService.hasPendingRequest(id);
  }

  async getProfileSpecialDetails(id: number) {
    let profileSpecialDetails: ProfileSpecialDetails = new ProfileSpecialDetails();
    profileSpecialDetails.bonusTotalNum = await this.getBonusTotalNum(id);
    profileSpecialDetails.leavesTotalNum = await this.getLeavesTotalNum(id);
    profileSpecialDetails.lastBonusGiven = await this.getLastBonusGiven(id);
    profileSpecialDetails.lastLeaveTaken = await this.getLastLeaveTaken(id);
    profileSpecialDetails.isOnLeave = await this.checkIfIsOnLeave(id);
    profileSpecialDetails.hasAnyVacationRequestPending = await this.checkIfHasAnyVacationRequestPending(id);
    return profileSpecialDetails;
  }

  async checkIfPasswordIsCorrect(id: number, password: string) {
    return await this.employeeService.checkIfPasswordIsCorrect(id, password);
  }

  async updatePassword(id: number, password: string) {
    return await this.employeeService.updatePassword(id, password);
  }






}


