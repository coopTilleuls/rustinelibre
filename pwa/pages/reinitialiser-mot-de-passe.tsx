import {NextPageWithLayout} from 'pages/_app';
import React, {ChangeEvent, useEffect, useState} from 'react';
import Head from 'next/head';
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useRouter} from 'next/router';
import {validatePassword} from '@utils/passwordValidator';
import {userResource} from '@resources/userResource';
import {errorRegex} from '@utils/errorRegex';
import Link from 'next/link';

const PasswordReset: NextPageWithLayout = () => {
  const router = useRouter();
  const {token} = router.query;

  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingSend, setPendingSend] = useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [passwordErrorText, setPasswordErrorText] = useState<string | null>(
    null
  );
  const [checkPasswordErrorText, setCheckPasswordErrorText] = useState<
    string | null
  >(null);

  const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    if (!validatePassword(event.target.value)) {
      setPasswordErrorText(
        'Votre mot de passe doit contenir 12 caractères, une majuscule, un caractère spécial et des chiffres.'
      );
    } else {
      setPasswordErrorText(null);
    }
  };

  const handleChangeCheckPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setCheckPassword(event.target.value);

    if (!validatePassword(event.target.value)) {
      setCheckPasswordErrorText(
        'Votre mot de passe doit contenir 12 caractères, une majuscule, un caractère spécial et des chiffres.'
      );
    } else {
      setCheckPasswordErrorText(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword || !checkPassword || passwordErrorText) {
      return;
    }

    if (newPassword !== checkPassword) {
      setErrorMessage('Vos 2 mots de passe ne sont pas identiques');
      return;
    }

    setErrorMessage(null);
    setPendingSend(true);

    try {
      await userResource.resetPassword({
        token: token,
        password: newPassword,
      });
      setSuccess(true);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }

    setPendingSend(false);
  };

  useEffect(() => {
    if (!token || token === '') {
      router.push('/');
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Réinitialiser mon mot de passe</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '80%'}}}>
          <Paper elevation={4} sx={{maxWidth: '100%', mt: 4, mx: 'auto'}}>
            {!success && (
              <Box
                width="100%"
                display="flex"
                gap={{md: 4}}
                flexDirection={{xs: 'column', md: 'row'}}
                justifyContent="flex-end"
                component="form"
                onSubmit={handleSubmit}
                noValidate>
                <Box
                  p={4}
                  sx={{backgroundColor: 'grey.200'}}
                  width="100%"
                  borderRadius={2}
                  maxWidth="lg"
                  mx="auto">
                  <Typography fontSize={22} fontWeight={600}>
                    Indiquez votre nouveau mot de passe
                  </Typography>
                  <Box
                    display="flex"
                    flexDirection={{xs: 'column', md: 'row'}}
                    justifyContent="flex-start"
                    gap={{md: 4}}>
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="newPassword"
                      label="Nouveau mot de passe"
                      type="password"
                      id="newPassword"
                      autoFocus
                      value={newPassword}
                      error={!!passwordErrorText}
                      helperText={passwordErrorText}
                      onChange={handleChangeNewPassword}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        width: {xs: '100%', md: '40%'},
                      }}
                    />
                    <TextField
                      margin="normal"
                      required
                      fullWidth
                      name="checkPassword"
                      label="Confirmer le mot de passe"
                      type="password"
                      id="checkPassword"
                      value={checkPassword}
                      error={!!checkPasswordErrorText}
                      helperText={checkPasswordErrorText}
                      onChange={handleChangeCheckPassword}
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '20px',
                        width: {xs: '100%', md: '40%'},
                      }}
                    />
                  </Box>
                  <Box textAlign="left">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        mt: 3,
                        textTransform: 'capitalize',
                        width: {xs: '100%', md: 'auto'},
                      }}>
                      {!pendingSend ? (
                        'Envoyer'
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
                </Box>
              </Box>
            )}
            {success && (
              <Paper
                elevation={4}
                sx={{
                  maxWidth: 400,
                  p: 4,
                  mt: 4,
                  mb: {xs: 10, md: 12},
                  mx: 'auto',
                  textAlign: 'center',
                }}>
                <Box>
                  Mot de passe mis à jour.
                  <Link href="/login" style={{textAlign: 'center'}}>
                    <Button variant="outlined">Se connecter</Button>
                  </Link>
                </Box>
              </Paper>
            )}
          </Paper>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default PasswordReset;
