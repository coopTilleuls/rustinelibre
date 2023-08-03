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

interface ConfirmAppointmentModalProps {
  optionalPage?: string;
  confirmAppointmentRequest: () => void;
  open?: boolean;
  onClose: () => void;
}

const ConfirmAppointmentModal = ({
  optionalPage,
  confirmAppointmentRequest,
  open,
  onClose,
}: ConfirmAppointmentModalProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      transitionDuration={0}
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
      <DialogContent
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}>
        <Typography variant="h4" gutterBottom>
          À lire avant de prendre rendez-vous.
        </Typography>
        {optionalPage && (
          <Typography
            sx={{mt: 2}}
            paragraph
            variant="body1"
            color="text.secondary"
            dangerouslySetInnerHTML={{__html: optionalPage}}
          />
        )}
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Button
          variant="contained"
          size="large"
          onClick={confirmAppointmentRequest}>
          Suivant
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmAppointmentModal;
