import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {userResource} from '@resources/userResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {Box, Typography, Button, CircularProgress} from '@mui/material';

const RemoveAccount = (): JSX.Element => {
  const router = useRouter();
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const [showModal, setShowModal] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
      setSuccessMessage('Votre compte a bien été supprimé.');
      setTimeout(() => {
        setPendingRemove(false);
        logout();
        router.push('/');
      }, 3000);
    } catch (e) {
      setPendingRemove(false);
      setErrorMessage(
        'Une erreur est survenue lors de la suppression de votre compte.'
      );
      setTimeout(() => setErrorMessage(null), 3000);
      setShowModal(false);
      return;
    }
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
              Supprimer
            </Button>
          </Box>
        </Box>
        <Box
          sx={{backgroundColor: 'white', width: '40%', visibility: 'hidden'}}
        />
      </Box>
      {showModal && (
        <ConfirmationModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onConfirm={() => handleRemove()}
          loading={pendingRemove}
          successMessage={successMessage}
          errorMessage={errorMessage}>
          Êtes-vous certain de vouloir supprimer votre compte ?
        </ConfirmationModal>
      )}
    </Box>
  );
};

export default RemoveAccount;
