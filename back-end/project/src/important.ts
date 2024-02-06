import { Employee } from "./entities/employee.entity";

export const databaseSchemaName = 'management_system';

export const jwtExpiresIn = '1d';
export const bcryptSaltOrRounds = 10;
export const selectColumns: (keyof Employee)[] = ['id', 'name', 'surname', 'email', 'startDate', 'vacationDays', 'salary', 'employmentType', 'department', 'employeeUid', 'isAccepted', 'isAdmin'];
