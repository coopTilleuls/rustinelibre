import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useContext} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {userResource} from '@resources/userResource';
import {useAccount} from '@contexts/AuthContext';
import {UserFormContext} from '@contexts/UserFormContext';
import {
  Container,
  Box,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import UserForm from '@components/profile/UserForm';

const Registration: NextPageWithLayout = ({}) => {
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const user = useAccount({redirectIfFound: '/'});
  const router = useRouter();

  const {firstName, lastName, email, password, passwordError} =
    useContext(UserFormContext);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (passwordError || !email || !password || !firstName || !lastName) {
      return;
    }

    setErrorMessage(null);
    setPendingRegistration(true);

    let newUser;
    try {
      newUser = await userResource.register({
        firstName: firstName,
        lastName: lastName,
        email: email,
        plainPassword: password,
      });
    } catch (e) {
      setErrorMessage('Inscription impossible');
    }

    if (newUser) {
      await router.push('/login');
    }

    setPendingRegistration(false);
  };

  return (
    <>
      <Head>
        <title>Inscription</title>
      </Head>
      <WebsiteLayout />
      <Container sx={{width: {xs: '100%', md: '50%'}}}>
        <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Avatar sx={{m: 1, backgroundColor: 'primary.main'}}>
              <PersonIcon />
            </Avatar>
            <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
              Je créé mon compte
            </Typography>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{mt: 1}}>
              <UserForm user={null} />
              <Button type="submit" variant="contained" sx={{my: 2}}>
                {!pendingRegistration ? (
                  'Créer mon compte'
                ) : (
                  <CircularProgress size={20} sx={{color: 'white'}} />
                )}
              </Button>
              {errorMessage && (
                <Typography variant="body1" color="error">
                  {errorMessage}
                </Typography>
              )}
            </Box>
            <Typography variant="body1" color="grey">
              En vous inscrivant, vous acceptez les conditions d’utilisation de
              l’application Bikelib et sa politique de confidentialité
            </Typography>
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default Registration;
