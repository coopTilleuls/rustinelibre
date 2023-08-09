import {NextPageWithLayout} from 'pages/_app';
import React, {ChangeEvent, useState} from 'react';
import Head from 'next/head';
import {userResource} from '@resources/userResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {
  Typography,
  Box,
  CircularProgress,
  Container,
  Alert,
  Button,
  Grid,
  TextField,
} from '@mui/material';
import {errorRegex} from '@utils/errorRegex';

const ForgottenPassword: NextPageWithLayout = () => {
  const [success, setSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingSend, setPendingSend] = useState<boolean>(false);
  const [email, setEmail] = useState<string | null>(null);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!email) {
      return;
    }
    setPendingSend(true);
    try {
      await userResource.forgotPassword({email: email});
      setSuccess(true);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }
    setPendingSend(false);
    setTimeout(() => {
      setSuccess(false);
      setErrorMessage(null);
    }, 5000);
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Mon compte</title>
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
            Mot de passe oublié
          </Typography>
          <Typography textAlign="center" mt={2} variant="h4" color="secondary">
            Renseignez votre email
          </Typography>
          <Box
            py={4}
            display="flex"
            flexDirection="column"
            gap={4}
            position="relative"
            alignItems="flex-start">
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
              <Grid container spacing={2} direction="column">
                <Grid item xs={12}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    value={email}
                    sx={{
                      backgroundColor: 'white',
                      borderRadius: 6,
                      width: '100%',
                    }}
                    inputProps={{maxLength: 50}}
                    onChange={handleChangeEmail}
                  />
                </Grid>
              </Grid>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button
                  disabled={pendingSend}
                  type="submit"
                  variant="contained"
                  size="large"
                  sx={{mt: 2, width: 'content-fit'}}>
                  {!pendingSend ? (
                    'Envoyer '
                  ) : (
                    <CircularProgress size={20} sx={{color: 'white'}} />
                  )}
                </Button>
                {success && (
                  <Alert severity="success" sx={{width: '100%', mt: 4}}>
                    Veuillez consulter vos emails pour mettre à jour votre mot
                    de passe.
                  </Alert>
                )}
                {errorMessage && (
                  <Alert severity="error" sx={{width: '100%', mt: 4}}>
                    {errorMessage}
                  </Alert>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default ForgottenPassword;
