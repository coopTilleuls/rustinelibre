import React from 'react';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import {
  Dialog,
  Box,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {useRouter} from 'next/router';

interface ConnectModalProps {
  open?: boolean;
  onClose: () => void;
}

const ConnectModal = ({open, onClose}: ConnectModalProps): JSX.Element => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();

  const handleLogin = (): void => {
    router.push('/login?next=' + encodeURIComponent(router.asPath));
  };

  const handleRegistration = (): void => {
    router.push('/inscription?next=' + encodeURIComponent(router.asPath));
  };

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
          Connectez-vous ou inscrivez-vous pour envoyer la demande au
          réparateur.
        </Typography>
        <Box display="flex" gap={2} my={4} justifyContent="center">
          <Button onClick={handleLogin} variant="contained" sx={{width: 150}}>
            Se connecter
          </Button>
          <Button
            onClick={handleRegistration}
            variant="outlined"
            sx={{width: 150}}>
            S&apos;inscrire
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
