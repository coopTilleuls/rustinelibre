import React, {useState} from 'react';
import {useRouter} from 'next/router';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {userResource} from '@resources/userResource';
import ConfirmationModal from '@components/common/ConfirmationModal';
import {Box, Typography, Button} from '@mui/material';

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
      sx={{
        mt: 1,
        bgcolor: 'white',
        px: {xs: 3, md: 5},
        py: {xs: 4, md: 5},
        boxShadow: 2,
        width: {xs: '90%', md: '55%'},
        borderRadius: 6,
        mx: 'auto',
        maxWidth: '700px',
        position: 'relative',
      }}>
      <Typography textAlign="center" pb={2} variant="h4" color="secondary">
        Supprimer de mon compte
      </Typography>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          size="large"
          onClick={() => setShowModal(true)}
          type="submit"
          variant="contained"
          sx={{
            mt: 3,
            textTransform: 'capitalize',
          }}>
          Supprimer
        </Button>
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
