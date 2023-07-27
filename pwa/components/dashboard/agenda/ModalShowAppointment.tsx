import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {Appointment} from '@interfaces/Appointment';
import AppointmentContent from '@components/dashboard/appointments/AppointmentContent';
import CloseIcon from '@mui/icons-material/Close';
import AppointmentActions from '../appointments/AppointmentActions';

type ModalShowAppointmentProps = {
  appointment: Appointment;
  openModal: boolean;
  handleCloseModal: (refresh: boolean | undefined) => void;
};

const ModalShowAppointment = ({
  appointment,
  openModal,
  handleCloseModal,
}: ModalShowAppointmentProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      fullScreen={isMobile}
      open={openModal}
      onClose={() => handleCloseModal(false)}
      aria-labelledby="Affichage d'un rendez-vous"
      aria-describedby="popup_show_appointment">
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Typography variant="h3" color="primary">
          Rendez-vous
        </Typography>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={() => handleCloseModal(false)}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <AppointmentContent
          appointmentProps={appointment}
          handleCloseModal={handleCloseModal}
        />
      </DialogContent>
      {appointment.status !== 'cancel' && appointment.status !== 'refused' && (
        <DialogActions sx={{p: 2}}>
          <AppointmentActions
            appointment={appointment}
            handleCloseModal={handleCloseModal}
          />
        </DialogActions>
      )}
    </Dialog>
  );
};

export default ModalShowAppointment;
