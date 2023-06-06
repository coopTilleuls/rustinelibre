import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useContext} from 'react';
import Head from 'next/head';
import {
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import {useAccount} from '@contexts/AuthContext';
import {UserFormContext} from '@contexts/UserFormContext';
import {userResource} from '@resources/userResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import UserForm from '@components/profile/UserForm';
import {RequestBody} from '@interfaces/Resource';

const MyProfile: NextPageWithLayout = () => {
  const {user, isLoadingFetchUser} = useAccount({redirectIfNotFound: '/login'});
  const [success, setSuccess] = useState<boolean>(false);
  const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {firstName, lastName, email, password, passwordError} =
    useContext(UserFormContext);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (passwordError || !firstName || !lastName || !user) {
      return;
    }

    setErrorMessage(null);
    setPendingUpdate(true);

    try {
      const bodyRequest: RequestBody = {
        firstName: firstName,
        lastName: lastName,
        email: email
      };
      if (password && password !== '' && password !== '***********') {
        bodyRequest['plainPassword'] = password;
      }
      await userResource.putById(user.id, bodyRequest);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e) {
      setErrorMessage('Mise à jour impossible');
    }

    setPendingUpdate(false);
  };

  return (
    <>
      <Head>
        <title>Mon profil</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          {isLoadingFetchUser ? (
            <Box display={'flex'} justifyContent={'center'} my={10}>
              <CircularProgress />
            </Box>
          ) : (
            <Paper
              elevation={4}
              sx={{
                maxWidth: 400,
                p: 4,
                mt: 4,
                mb: {xs: 10, md: 12},
                mx: 'auto',
              }}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
                  Mon profil
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{mt: 1}}>
                  <UserForm user={user} />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center">
                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      sx={{mt: 3, mb: 2, width: '50%'}}>
                      {!pendingUpdate ? (
                        'Enregistrer'
                      ) : (
                        <CircularProgress size={20} sx={{color: 'white'}} />
                      )}
                    </Button>
                  </Box>
                  {errorMessage && (
                    <Typography variant="body1" color="error">
                      {errorMessage}
                    </Typography>
                  )}
                  {success && (
                    <Alert sx={{width: '100%'}} severity="success">
                      Profil mis à jour
                    </Alert>
                  )}
                </Box>
              </Box>
            </Paper>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default MyProfile;
