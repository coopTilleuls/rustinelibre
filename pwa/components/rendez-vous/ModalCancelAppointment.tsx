import React from 'react';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {Appointment} from '@interfaces/Appointment';
import {formatDate} from '@helpers/dateHelper';

type ModalCancelAppointmentProps = {
  appointment: Appointment;
  openModal: boolean;
  loading: boolean;
  errorMessage: string | null;
  handleCloseModal: () => void;
  handleCancelAppointment: () => void;
};

const ModalCancelAppointment = ({
  appointment,
  openModal,
  loading,
  errorMessage,
  handleCloseModal,
  handleCancelAppointment,
}: ModalCancelAppointmentProps): JSX.Element => {
  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="Annuler un rendez-vous"
      aria-describedby="modal_cancel_appointment">
      <DialogTitle
        sx={{
          m: 0,
          p: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <IconButton
          aria-label="close"
          color="primary"
          onClick={handleCloseModal}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{pt: 0, pb: 4, borderTop: 'none'}}>
        <Typography variant="h5" gutterBottom>
          Êtes-vous sûr(e) de vouloir annuler ce rendez-vous ?
        </Typography>
        <Typography color="text.secondary">
          {`Vous êtes sur le point d'annuler votre rendez-vous du ${formatDate(
            appointment?.slotTime
          )} avec le réparateur ${appointment.repairer.name}.`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button variant="outlined" color="secondary" onClick={handleCloseModal}>
          Annuler
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleCancelAppointment}
          startIcon={
            loading && <CircularProgress size={18} sx={{color: 'white'}} />
          }>
          Valider
        </Button>
        {errorMessage && (
          <Typography color="error" textAlign="center" sx={{pt: 4}}>
            {errorMessage}
          </Typography>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ModalCancelAppointment;
