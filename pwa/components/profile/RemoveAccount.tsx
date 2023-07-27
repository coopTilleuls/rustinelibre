import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {userResource} from '@resources/userResource';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Modal,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const RemoveAccount = (): JSX.Element => {
  const router = useRouter();
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingRemove, setPendingRemove] = useState<boolean>(false);
  const {logout} = useAuth();

  const handleRemove = async () => {
    if (!user) {
      setShowModal(false);
      return;
    }

    setPendingRemove(true);

    try {
      await userResource.deleteById(user.id);
    } catch (error) {
      setPendingRemove(false);
      setShowModal(false);
      setErrorMessage(
        'Une erreur est survenue lors de la suppression de votre compte'
      );
      setTimeout(() => setErrorMessage(null), 3000);
      return;
    }

    setPendingRemove(false);
    setShowModal(false);
    setSuccessMessage(true);
    setTimeout(() => {
      logout();
      router.push('/');
    }, 3000);
  };

  return (
    <Box
      mt={8}
      p={4}
      sx={{backgroundColor: 'grey.200'}}
      width="100%"
      borderRadius={2}
      maxWidth="lg"
      mx="auto">
      <Typography fontSize={22} fontWeight={600}>
        Suppression de mon compte
      </Typography>
      <Box
        width="100%"
        display="flex"
        gap={{md: 4}}
        flexDirection={{xs: 'column', md: 'row'}}
        justifyContent="flex-end">
        <Box
          display="flex"
          flexDirection="column"
          width={{xs: '100%', md: '40%'}}>
          <Box display="flex" flexDirection="column" alignItems="start">
            <Button
              onClick={() => setShowModal(true)}
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                textTransform: 'capitalize',
                width: {xs: '100%', md: 'auto'},
              }}>
              {!pendingRemove ? (
                'Supprimer'
              ) : (
                <CircularProgress size={20} sx={{color: 'white'}} />
              )}
            </Button>
          </Box>
        </Box>
        <Box
          sx={{backgroundColor: 'white', width: '40%', visibility: 'hidden'}}
        />
      </Box>
      {showModal && (
        <Dialog
          maxWidth="sm"
          fullWidth
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="Suppression d'un compte"
          aria-describedby="modal_delete_account">
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
              onClick={() => setShowModal(false)}>
              <CloseIcon fontSize="large" />
            </IconButton>
          </DialogTitle>
          <DialogContent dividers sx={{pt: 0, pb: 4, borderTop: 'none'}}>
            <Typography variant="h5" gutterBottom>
              Êtes-vous certain de vouloir supprimer votre compte ?
            </Typography>
            <Typography color="text.secondary">
              Vous êtes sur le point de supprimer définitivement votre compte.
            </Typography>
          </DialogContent>
          <DialogActions sx={{p: 2}}>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowModal(false)}>
              Annuler
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemove()}
              startIcon={
                pendingRemove && (
                  <CircularProgress size={18} sx={{color: 'white'}} />
                )
              }>
              Confirmer
            </Button>
          </DialogActions>
          {errorMessage && (
            <Alert sx={{width: '100%'}} severity="error">
              {errorMessage}
            </Alert>
          )}
          {successMessage && (
            <Alert sx={{width: '100%'}} severity="success">
              Votre compte a bien été supprimé.
            </Alert>
          )}
        </Dialog>
      )}
    </Box>
  );
};

export default RemoveAccount;
