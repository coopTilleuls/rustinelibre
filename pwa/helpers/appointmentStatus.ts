import {Appointment} from '@interfaces/Appointment';

export const getAppointmentStatus = (status: string): string => {
  switch (status) {
    case 'validated':
      return 'Validé';
    case 'refused':
      return 'Refusé';
    case 'cancel':
      return 'Annulé';
    default:
      return 'En attente';
  }
};

export const getAutodiagBikeName = (
  appointment: Appointment
): string | undefined => {
  if (appointment.autoDiagnostic) {
    return appointment.autoDiagnostic.prestation;
  }

  if (appointment.bike) {
    return appointment.bike.name;
  }

  if (appointment.bikeType) {
    return appointment.bikeType.name;
  }

  return '';
};
