import React from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {Repairer} from '@interfaces/Repairer';
import {isRepairerItinerant} from '@helpers/rolesHelpers';

interface RecapAppointmentModalProps {
  repairer: Repairer;
  slotSelected: string;
  confirmAppointment: () => void;
  open?: boolean;
  onClose: () => void;
}

const RecapAppointmentModal = ({
  repairer,
  slotSelected,
  confirmAppointment,
  open,
  onClose,
}: RecapAppointmentModalProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const date: string = new Date(slotSelected).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      transitionDuration={0}
      fullScreen={isMobile}
      open={!!open}
      onClose={onClose}>
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        <IconButton aria-label="close" color="primary" onClick={onClose}>
          <CloseIcon fontSize="large" />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{textAlign: 'center'}}>
        <Typography variant="h4" gutterBottom>
          Récapitulatif
        </Typography>
        <Typography
          sx={{mt: 2}}
          paragraph
          variant="body1"
          color="text.secondary">
          {' '}
          {isRepairerItinerant(repairer)
            ? `Votre RDV: ${date} avec "${repairer.name}"`
            : `Votre RDV: ${date} chez ${repairer.name}`}
        </Typography>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button size="large" onClick={confirmAppointment} variant="contained">
          Confirmer le rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecapAppointmentModal;
