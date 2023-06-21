export const formatDate = (dateString: string | undefined, withHour: boolean = true): string => {
  if (typeof dateString === 'undefined') {
    return '';
  }

  let date = getDateTimeZoned(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (withHour) {
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  return `${day}/${month}/${year}`;
};

export const isPast = (targetDate: string): boolean => {
  const currentDate = new Date();
  const parsedTargetDate = new Date(targetDate);

  if (isNaN(parsedTargetDate.getTime())) {
    return false;
  }

  return parsedTargetDate < currentDate;
}

export const dateObjectAsString = (date: Date, withHours: boolean = true): string => {
  const year = date.getFullYear();
  const month = padNumber(date.getMonth() + 1);
  const day = padNumber(date.getDate());
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());

  if (withHours) {
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }

  return `${year}-${month}-${day}`;
}

export const getTimeFromObjectAsString = (date: Date, withHours: boolean = true): string => {
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());

  return `${hours} : ${minutes}`;
}

export const getDateFromDateAsString = (slotTime: string): string => {
  const dateObj = getDateTimeZoned(slotTime)
  const year = dateObj.getFullYear();
  const month = padNumber(dateObj.getMonth() + 1);
  const day = padNumber(dateObj.getDate());

  return `${day}/${month}/${year}`;
}

export const getTimeFromDateAsString = (slotTime: string): string => {
  const dateObj = getDateTimeZoned(slotTime);
  const hours = padNumber(dateObj.getHours());
  const minutes = padNumber(dateObj.getMinutes());

  return `${hours}:${minutes}`;
}


const padNumber = (number: number): string => {
  return number.toString().padStart(2, '0');
}

export const getDateTimeZoned = (dateString: string|null = null): Date => {

  let date = new Date(dateString ? dateString : '');
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  date = new Date(date.getTime() + userTimezoneOffset);

  return date;
}