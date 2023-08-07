import React from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  DialogActions,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import Link from 'next/link';

interface ConnectModalProps {
  open?: boolean;
  onClose: () => void;
}

const NotCyclistModal = ({open, onClose}: ConnectModalProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
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
          Merci de vous connecter avec un compte utilisateur pour prendre un
          rendez-vous. <br />
          Sinon vous pouvez créer des RDV depuis votre back-office
        </Typography>
      </DialogContent>
      <DialogActions sx={{p: 2}}>
        <Link href="/sradmin" legacyBehavior passHref>
          <Button variant="contained">Accéder au back office</Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default NotCyclistModal;
