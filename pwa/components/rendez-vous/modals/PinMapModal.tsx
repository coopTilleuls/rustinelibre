import React, {PropsWithChildren} from 'react';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';

interface PinMapModalProps extends PropsWithChildren {
  open?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PinMapModal = ({
  children,
  open,
  onClose,
  onConfirm,
}: PinMapModalProps): JSX.Element => {
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
      <DialogContent sx={{textAlign: 'center'}}>{children}</DialogContent>
    </Dialog>
  );
};

export default PinMapModal;
