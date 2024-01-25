export const backEndBaseUrl = 'http://localhost:3001';

export const authUrl =  '/auth';
export const bonusUrl = '/bonus';
export const employeeUrl = '/employee';
export const departmentUrl = '/department';
export const vacationRequestUrl = '/vrequest';

export const backEndAuthUrl = backEndBaseUrl + authUrl;
export const backEndBonusUrl = backEndBaseUrl + bonusUrl;
export const backEndEmployeeUrl = backEndBaseUrl + employeeUrl;
export const backEndDepartmentUrl = backEndBaseUrl + departmentUrl;
export const backEndVacationRequestUrl = backEndBaseUrl + vacationRequestUrl;

export const standartGetAllExtension = '/all';
export const getAllBonus = backEndBonusUrl + standartGetAllExtension;
export const getAllDepartment = backEndDepartmentUrl + standartGetAllExtension;
export const getAllEmployee = backEndEmployeeUrl + standartGetAllExtension;
export const getAllVacationRequest = backEndVacationRequestUrl + standartGetAllExtension;
export const employeeInfoUrl = '/employee/view/';
export const departmentInfoUrl = '/department/view/';
export const getAllAndCountOnUserBaseUrl = backEndDepartmentUrl+'/all/countonuser';
export const getAndCountOnUserBaseUrl = backEndDepartmentUrl+'/countonuser';
export const moreInformationLinkBase = 'view/';
export const editLinkBase = 'edit/';

export const redirectWhenHasNoAccess = '/signIn';
export const redirectWhenIsNotAdmin = -1;
export const accessTokenCookie = 'access_token';
export const adminCookie = 'admin';



