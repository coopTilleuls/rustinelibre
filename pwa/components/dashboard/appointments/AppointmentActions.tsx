import React, {useState} from 'react';
import {appointmentResource} from '@resources/appointmentResource';
import {CircularProgress, Button, useMediaQuery} from '@mui/material';
import {isPast} from '@helpers/dateHelper';
import {Appointment} from '@interfaces/Appointment';
import theme from 'styles/theme';

type AppointmentActionsProps = {
  appointment: Appointment;
  closeModal: () => void;
  proposeOtherSlot: boolean;
  handleClickProposeOtherSlot: () => void;
};

const AppointmentActions = ({
  appointment,
  closeModal,
  proposeOtherSlot,
  handleClickProposeOtherSlot,
}: AppointmentActionsProps): JSX.Element => {
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [pendingAccept, setPendingAccept] = useState<boolean>(false);
  const [pendingRefuse, setPendingRefuse] = useState<boolean>(false);
  const [pendingCancel, setPendingCancel] = useState<boolean>(false);

  const handleClickAcceptAppointment = async (appointmentId: string) => {
    setPendingAccept(true);
    await appointmentResource.updateAppointmentStatus(appointmentId, {
      transition: 'validated_by_repairer',
    });
    setPendingAccept(false);
    closeModal();
  };

  const handleClickRefuseAppointment = async (appointmentId: string) => {
    setPendingRefuse(true);
    await appointmentResource.updateAppointmentStatus(appointmentId, {
      transition: 'refused',
    });
    setPendingRefuse(false);
    closeModal();
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
    closeModal();
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
        <>
          <Button
            size="medium"
            disabled={isPast(appointment.slotTime) || proposeOtherSlot}
            color="secondary"
            variant="outlined"
            onClick={handleClickProposeOtherSlot}>
            {isMobile ? 'Modifier RDV' : 'Modifier le rendez-vous'}
          </Button>
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
            {isMobile ? 'Annuler RDV' : 'Annuler le rendez-vous'}
          </Button>
        </>
      )}
    </>
  );
};

export default AppointmentActions;
