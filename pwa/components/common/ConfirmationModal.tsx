import {PropsWithChildren} from 'react';
import {
  Alert,
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

interface ConfirmationModalProps extends PropsWithChildren {
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
  loading?: boolean;
  confirmationLabel?: string;
  successMessage?: string | null;
  errorMessage?: string | null;
}

const ConfirmationModal = ({
  onClose,
  onConfirm,
  open,
  loading,
  confirmationLabel = 'Valider',
  children,
  successMessage,
  errorMessage,
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
    <DialogContent
      dividers
      sx={{
        pt: 0,
        pb: errorMessage || successMessage ? 3 : 4,
        borderTop: 'none',
      }}>
      <DialogContentText>{children}</DialogContentText>
      {errorMessage && (
        <Alert color="error" sx={{mt: 2}}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert color="success" sx={{mt: 2}}>
          {successMessage}
        </Alert>
      )}
    </DialogContent>
    <DialogActions sx={{p: 2}}>
      <Button variant="outlined" color="secondary" onClick={onClose}>
        Annuler
      </Button>
      <Button variant="contained" color="error" onClick={onConfirm}>
        {loading ? (
          <CircularProgress size={24} sx={{color: 'white'}} />
        ) : (
          confirmationLabel
        )}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmationModal;
