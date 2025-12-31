import { date } from "quasar";

export function isBefore(date1, date2) {
  const sourceDate = date.extractDate(date1, "DD-MM-YYYY");
  const targetDate = date.extractDate(date2, "DD-MM-YYYY");
  if (sourceDate < targetDate) {
    return true;
  }
}

export function isEqual(date1, date2) {
  const sourceDate = date.extractDate(date1, "DD-MM-YYYY");
  const targetDate = date.extractDate(date2, "DD-MM-YYYY");
  if (sourceDate === targetDate) {
    return true;
  }
}

export function isAfter(date1, date2) {
  const sourceDate = date.extractDate(date1, "DD-MM-YYYY");
  const targetDate = date.extractDate(date2, "DD-MM-YYYY");
  if (sourceDate > targetDate) {
    return true;
  }
}
