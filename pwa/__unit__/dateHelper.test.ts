import {
  dateObjectAsString,
  formatDate,
  getDateFromDateAsString,
  getTimeFromDateAsString,
  getTimeFromObjectAsString,
  isPast,
  padNumber,
} from '@helpers/dateHelper';

describe('Testing the formatDate function', () => {
  test('Should return a date formatted with time if date is set and withHour is true', () => {
    expect(formatDate('2023-07-19T14:30:00.000Z', true)).toBe(
      '19/07/2023 14:30'
    );
  });

  test('Should return a date formatted without time if date is set and withHour is false', () => {
    expect(formatDate('2023-07-19T14:30:00.000Z', false)).toBe('19/07/2023');
  });

  test('Should return an empty string if date is undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });
});

describe('Testing the isPast function', () => {
  test('Should return true if the target date is in the past', () => {
    expect(isPast('2023-07-18T14:30:00.000Z')).toBeTruthy();
  });

  test('Should return false if target date is in the future (today date + 1 day)', () => {
    const currentDate = new Date();
    const futureDate = new Date(currentDate);
    futureDate.setDate(currentDate.getDate() + 1);
    expect(isPast(futureDate.toISOString())).toBeFalsy();
  });

  test('Should return false if target date is not parsable', () => {
    expect(isPast('invalid_date')).toBeFalsy();
  });

  test('Should return false if the target date is equal to the current date', () => {
    expect(isPast(new Date().toISOString())).toBeFalsy();
  });
});

describe('Testing the dateObjectAsString function', () => {
  test("Should return a date in the format 'YYYY-MM-DD HH:mm' if withHours is true", () => {
    expect(dateObjectAsString(new Date('2023-07-19T14:30:00'), true)).toBe(
      '2023-07-19 14:30'
    );
  });

  test("Should return a date in 'YYYY-MM-DD' format if withHours is false", () => {
    expect(dateObjectAsString(new Date('2023-07-19T14:30:00'), false)).toBe(
      '2023-07-19'
    );
  });
});

describe('Testing the getTimeFromObjectAsString function', () => {
  test("Should return time in 'HH:mm' format if date has hours and minutes", () => {
    expect(getTimeFromObjectAsString(new Date('2023-07-19T14:30:00'))).toBe(
      '14:30'
    );
  });
});

describe('Testing the getDateFromDateAsString function', () => {
  test("Should return date in 'DD/MM/YYYY' format for a valid date", () => {
    expect(getDateFromDateAsString('2023-07-19T14:30:00.000Z')).toBe(
      '19/07/2023'
    );
  });

  test('Should return an empty string if the date is not parsable', () => {
    expect(getDateFromDateAsString('date_invalide')).toBe('');
  });
});

describe('Testing the getTimeFromDateAsString function', () => {
  test("Should return time in 'HH:mm' format for a valid date with hours and minutes", () => {
    expect(getTimeFromDateAsString('2023-07-19T14:30:00.000Z')).toBe('14:30');
  });

  test("Should return time in 'HH:mm' format for a valid date with hours but no minutes", () => {
    expect(getTimeFromDateAsString('2023-07-19T08:00:00.000Z')).toBe('08:00');
  });

  test("Should return time in 'HH:mm' format for a valid date with minutes and at midnight", () => {
    expect(getTimeFromDateAsString('2023-07-19T00:30:00.000Z')).toBe('00:30');
  });

  test('Should return an empty string if the date is not parsable', () => {
    expect(getTimeFromDateAsString('invalid_date')).toBe('');
  });
});

describe('Testing the padNumber function', () => {
  test('Should add a zero in front of a number less than 10', () => {
    expect(padNumber(5)).toBe('05');
  });

  test('Should not add a zero in front of a number equal to or greater than 10', () => {
    expect(padNumber(15)).toBe('15');
  });

  test("Should return '00' for the number 0", () => {
    expect(padNumber(0)).toBe('00');
  });

  test("Should return '01' for number 1", () => {
    expect(padNumber(1)).toBe('01');
  });

  test("Should return '10' for the number 10", () => {
    expect(padNumber(10)).toBe('10');
  });
});
