export const backEndBaseUrl = 'http://localhost:3001';

export const backEndAuthUrl = backEndBaseUrl + '/auth';
export const backEndBonusUrl = backEndBaseUrl + '/bonus';
export const backEndEmployeeUrl = backEndBaseUrl + '/employee';
export const backEndEmployeeProductUrl = backEndBaseUrl + '/eproduct';
export const backEndDepartmentUrl = backEndBaseUrl + '/department';
export const backEndVacationRequestUrl = backEndBaseUrl + '/vrequest';
export const backEndUserRequestUrl = backEndBaseUrl + '/user';
export const backEndProjectUrl = backEndBaseUrl + '/project';
export const standartGetAllExtension = '/all';
export const getAllBonus = backEndBonusUrl + standartGetAllExtension;
export const getAllDepartment = backEndDepartmentUrl + standartGetAllExtension;
export const getAllEmployee = backEndEmployeeUrl + standartGetAllExtension;
export const getAllVacationRequest = backEndVacationRequestUrl + standartGetAllExtension;
export const getAllUserRequest = backEndUserRequestUrl + standartGetAllExtension;
export const getAllProject = backEndProjectUrl + standartGetAllExtension;
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



