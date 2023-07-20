import {getAppointmentStatus} from '@helpers/appointmentStatus';

describe('Testing the appointmentStatus render', () => {
  test("Should return 'Validated' if status is 'validated'", () => {
    expect(getAppointmentStatus('validated')).toBe('Validé');
  });

  test("Should return 'Refused' if status is 'refused'", () => {
    expect(getAppointmentStatus('refused')).toBe('Refusé');
  });

  test("Should return 'Cancelled' if status is 'cancel'", () => {
    expect(getAppointmentStatus('cancel')).toBe('Annulé');
  });

  test("Should return 'Pending' in all other cases", () => {
    expect(getAppointmentStatus('')).toBe('En attente');
  });
});
