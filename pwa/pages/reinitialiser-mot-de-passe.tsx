import {NextPageWithLayout} from 'pages/_app';
import React, {ChangeEvent, useState} from 'react';
import {GetServerSideProps, InferGetServerSidePropsType} from 'next';
import Head from 'next/head';
import Link from 'next/link';
import {userResource} from '@resources/userResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  TextField,
  Button,
  Grid,
  Alert,
} from '@mui/material';
import {validatePassword} from '@utils/passwordValidator';
import {errorRegex} from '@utils/errorRegex';

const PasswordReset: NextPageWithLayout = ({
  token,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
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
      setTimeout(() => {
        setErrorMessage(null);
      }, 3000);
    }

    setPendingSend(false);
  };

  return (
    <>
      <Head>
        <title>Réinitialiser mon mot de passe</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          <Typography
            textAlign="center"
            variant="h1"
            sx={{mt: 4}}
            color="primary">
            Réinitialiser mon mot de passe
          </Typography>
          <Box
            py={4}
            display="flex"
            flexDirection="column"
            gap={4}
            position="relative"
            alignItems="flex-start">
            {!success && (
              <Box
                onSubmit={handleSubmit}
                component="form"
                noValidate
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
                <Grid container direction="column">
                  <Typography
                    textAlign="center"
                    pb={2}
                    variant="h4"
                    color="secondary">
                    Indiquez votre nouveau mot de passe
                  </Typography>
                  <Grid
                    container
                    item
                    xs={12}
                    spacing={{xs: 0, md: 2}}
                    direction="row">
                    <Grid item xs={12} sm={6} md={12} lg={6}>
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
                          borderRadius: 6,
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={12} lg={6}>
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
                          borderRadius: 6,
                        }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Box textAlign="center">
                  <Button
                    size="large"
                    disabled={pendingSend}
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      textTransform: 'capitalize',
                    }}>
                    {!pendingSend ? (
                      'Envoyer'
                    ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                    )}
                  </Button>
                </Box>
                {errorMessage && (
                  <Alert severity="error" sx={{mt: 4}}>
                    {errorMessage}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{mt: 4}}>
                    Mot de passe mis à jour.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
          {success && (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={4}
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
              <Typography textAlign="center" variant="h4" color="secondary">
                Mot de passe mis à jour.
              </Typography>
              <Link
                legacyBehavior
                passHref
                href="/login"
                style={{textAlign: 'center'}}>
                <Button size="large" variant="contained">
                  Se connecter
                </Button>
              </Link>
            </Box>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default PasswordReset;

export const getServerSideProps: GetServerSideProps = async ({query}) => {
  if (!query.token) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      token: query.token,
    },
  };
};
