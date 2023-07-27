import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {PropsWithChildren} from 'react';

interface ConfirmationModalProps extends PropsWithChildren {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  loading?: boolean;
  confirmationLabel?: string;
}

const ConfirmationModal = ({
  onClose,
  onConfirm,
  open,
  loading,
  confirmationLabel = 'Valider',
  children,
}: ConfirmationModalProps) => (
  <Dialog maxWidth="sm" fullWidth open={open} onClose={onClose}>
    <DialogTitle
      sx={{
        m: 0,
        py: 2,
        pl: 3,
        pr: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <Typography id="modal-modal-title" variant="h3" color="primary">
        Confirmation
      </Typography>
      <IconButton aria-label="close" color="primary" onClick={onClose}>
        <CloseIcon fontSize="large" />
      </IconButton>
    </DialogTitle>
    <DialogContent dividers sx={{pt: 0, pb: 4, borderTop: 'none'}}>
      <DialogContentText>{children}</DialogContentText>
    </DialogContent>
    <DialogActions sx={{p: 2}}>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Annuler
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        {loading ? (
          <CircularProgress sx={{color: 'white'}} />
        ) : (
          confirmationLabel
        )}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;
