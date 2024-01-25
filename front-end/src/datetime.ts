import moment from 'moment';

export function getDate(date:Date, format: string ) {
   return moment(date).format(format);
}

export function getCurrentDate(format: string ) {
    return moment().format(format);
}

export function getDateFromCurrentDate(daysFromCurrentDate:number, format: string ) {
    return moment().add(daysFromCurrentDate, "days").format(format)
}

export function checkIfDateIsValid(date:Date) {
    return moment.utc(date, true).isValid();
}

export function getDayNumberFromDayName(date:Date) {
    return date.getDay()
}

export function calculateDateDifference(startDate:any, endDate:any) {
    return endDate.diff(startDate, "days");
}

export function getUTCdate(date:any, format:any) {
    return moment.utc(date, format, true);
}