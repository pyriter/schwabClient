import {Month} from '../models/optionChain';

export function convertToMonth(month: number) {
  switch (month) {
    case 0:
      return Month.JAN;
    case 1:
      return Month.FEB;
    case 2:
      return Month.MAR;
    case 3:
      return Month.APR;
    case 4:
      return Month.MAY;
    case 5:
      return Month.JUN;
    case 6:
      return Month.JUL;
    case 7:
      return Month.AUG;
    case 8:
      return Month.SEP;
    case 9:
      return Month.OCT;
    case 10:
      return Month.NOV;
    case 11:
      return Month.DEC;
  }
}

export function getYYYYMMDD(date: Date): string {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  const yearStr = padNumber(year, 4);
  const monthStr = padNumber(month, 2);
  const dayStr = padNumber(day, 2);
  return `${yearStr}-${monthStr}-${dayStr}`;
}

export function padNumber(n: number, padding: number): string {
  return String(n).padStart(padding, '0');
}
