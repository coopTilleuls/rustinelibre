import React, {useState} from 'react';
import {appointmentResource} from '@resources/appointmentResource';
import {CircularProgress, Button} from '@mui/material';
import {isPast} from '@helpers/dateHelper';
import {Appointment} from '@interfaces/Appointment';

type AppointmentActionsProps = {
  appointment: Appointment;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const AppointmentActions = ({
  appointment,
  handleCloseModal,
}: AppointmentActionsProps): JSX.Element => {
  const [pendingAccept, setPendingAccept] = useState<boolean>(false);
  const [pendingRefuse, setPendingRefuse] = useState<boolean>(false);
  const [pendingCancel, setPendingCancel] = useState<boolean>(false);

  const handleClickAcceptAppointment = async (appointmentId: string) => {
    setPendingAccept(true);
    await appointmentResource.updateAppointmentStatus(appointmentId, {
      transition: 'validated_by_repairer',
    });
    handleCloseModal(true);
    setPendingAccept(false);
  };

  const handleClickRefuseAppointment = async (appointmentId: string) => {
    setPendingRefuse(true);
    await appointmentResource.updateAppointmentStatus(appointmentId, {
      transition: 'refused',
    });
    handleCloseModal(true);
    setPendingRefuse(false);
  };

  const cancelAppointment = async () => {
    if (!appointment) {
      return;
    }
    setPendingCancel(true);
    await appointmentResource.updateAppointmentStatus(appointment.id, {
      transition: 'cancellation',
    });
    setPendingCancel(false);
    handleCloseModal(true);
  };

  return (
    <>
      {appointment.status === 'pending_repairer' && (
        <>
          <Button
            size="medium"
            variant="outlined"
            color="error"
            onClick={() => handleClickRefuseAppointment(appointment.id)}
            startIcon={
              pendingRefuse && <CircularProgress size={18} color="error" />
            }>
            Refuser le RDV
          </Button>
          <Button
            size="medium"
            variant="contained"
            onClick={() => handleClickAcceptAppointment(appointment.id)}
            startIcon={
              pendingAccept && (
                <CircularProgress size={18} sx={{color: 'white'}} />
              )
            }>
            Accepter le RDV
          </Button>
        </>
      )}
      {appointment.status === 'validated' && (
        <Button
          size="medium"
          color="error"
          disabled={isPast(appointment.slotTime)}
          variant="contained"
          onClick={cancelAppointment}
          startIcon={
            pendingCancel && (
              <CircularProgress size={18} sx={{color: 'white'}} />
            )
          }>
          Annuler le rendez-vous
        </Button>
      )}
    </>
  );
};

export default AppointmentActions;
