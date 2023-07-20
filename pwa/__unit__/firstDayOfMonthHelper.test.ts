import {getFirstDaysOfMonth} from '@helpers/firstDayOfMonthHelper';

describe('Testing the getFirstDaysOfMonth function', () => {
  test('Should return the first days of the current month and the following month', () => {
    const firstDayOfMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );
    const firstDayOfNextMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      1
    );
    expect(getFirstDaysOfMonth().firstDayOfMonth).toBe(
      firstDayOfMonth.toISOString().split('T')[0]
    );
    expect(getFirstDaysOfMonth().firstDayOfNextMonth).toBe(
      firstDayOfNextMonth.toISOString().split('T')[0]
    );
  });
});
