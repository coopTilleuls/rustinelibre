import React, {useState} from 'react';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {userResource} from '@resources/userResource';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Modal,
} from '@mui/material';
import {useRouter} from 'next/router';

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
      await userResource.delete(user.id);
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
      mx="auto"
    >
      <Typography fontSize={22} fontWeight={600}>
        Suppression de mon compte
      </Typography>
      <Box
        width="100%"
        display="flex"
        gap={{md: 4}}
        flexDirection={{xs: 'column', md: 'row'}}
        justifyContent="flex-end"
      >
        <Box
          display="flex"
          flexDirection="column"
          width={{xs: '100%', md: '40%'}}
        >
          <Box display="flex" flexDirection="column" alignItems="start">
            <Button
              onClick={() => setShowModal(true)}
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                textTransform: 'capitalize',
                width: {xs: '100%', md: 'auto'},
              }}
            >
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
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          aria-labelledby="Suppression de mon compte"
          aria-describedby="popup_remove_account"
        >
          <Box
            position={'absolute'}
            top={'50%'}
            left={'50%'}
            width={{xs: '85%', md: '40%'}}
            maxWidth={700}
            p={4}
            boxShadow={24}
            sx={{
              backgroundColor: 'background.paper',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <Typography>
              Êtes-vous certain de vouloir supprimer votre compte ?
            </Typography>

            <Button
              onClick={() => setShowModal(false)}
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                textTransform: 'capitalize',
                width: {xs: '100%', md: 'auto'},
              }}
            >
              Annuler
            </Button>

            <Button
              onClick={() => handleRemove()}
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                ml: 3,
                textTransform: 'capitalize',
                width: {xs: '100%', md: 'auto'},
              }}
            >
              {!pendingRemove ? (
                'Confirmer'
              ) : (
                <CircularProgress size={20} sx={{color: 'white'}} />
              )}
            </Button>
          </Box>
        </Modal>
      )}

      {errorMessage && (
        <Alert sx={{width: '100%', mt: 4}} severity="error">
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert sx={{width: '100%', mt: 4}} severity="success">
          Votre compte a bien été supprimé.
        </Alert>
      )}
    </Box>
  );
};

export default RemoveAccount;
