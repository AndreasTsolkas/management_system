import { Bonus } from "src/entities/bonus.entity";
import { VacationRequest } from "src/entities/vacation_request.entity";

export class ProfileSpecialDetails {
    bonusTotalNum: number;
    leavesTotalNum: number; // Approved vacation requests
    lastBonusGiven: Bonus;
    lastLeaveTaken: VacationRequest;
    isOnLeave: boolean;
    hasAnyVacationRequestPending: boolean;
}