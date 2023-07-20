export const getFirstDaysOfMonth = (): {
  firstDayOfMonth: string;
  firstDayOfNextMonth: string;
} => {
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const firstDayOfNextMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const firstDayOfMonthFormatted = firstDayOfMonth.toISOString().split('T')[0];
  const firstDayOfNextMonthFormatted = firstDayOfNextMonth
    .toISOString()
    .split('T')[0];

  return {
    firstDayOfMonth: firstDayOfMonthFormatted,
    firstDayOfNextMonth: firstDayOfNextMonthFormatted,
  };
};
