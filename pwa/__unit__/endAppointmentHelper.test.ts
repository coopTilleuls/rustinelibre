import {getEndAppointment} from '@helpers/endAppointmentHelper';

describe('Testing the getEndAppointment function', () => {
  test('Should return the end date of an appointment for 30 min duration', () => {
    expect(getEndAppointment('2023-07-19T14:30:00.000Z', 30)).toBe(
      '2023-07-19T15:00:00.000Z'
    );
  });

  test('Should return the end date of an appointment for 60 min duration', () => {
    expect(getEndAppointment('2023-07-19T14:30:00.000Z', 60)).toBe(
      '2023-07-19T15:30:00.000Z'
    );
  });
});
