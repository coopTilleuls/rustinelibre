import {NextPageWithLayout} from 'pages/_app';
import React, {ChangeEvent, useState} from 'react';
import Head from 'next/head';
import {contactResource} from '@resources/ContactResource';
import {Turnstile} from '@marsidev/react-turnstile';
import {
  Container,
  Typography,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Grid,
  useMediaQuery,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {errorRegex} from '@utils/errorRegex';
import theme from 'styles/theme';

const cfTurnstileAPIKey = process.env
  .NEXT_PUBLIC_CF_TURNSTILE_SITE_KEY as string;

type Status = 'error' | 'expired' | 'solved';

const Contact: NextPageWithLayout = () => {
  const [lastName, setLastName] = useState<string>('');
  const [lastNameError, setLastNameError] = useState<string>('');

  const [firstName, setFirstName] = useState<string>('');
  const [firstNameError, setFirstNameError] = useState<string>('');

  const [email, setEmail] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

  const [message, setMessage] = useState<string>('');
  const [messageError, setMessageError] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [status, setStatus] = useState<Status | null>(null);

  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await contactResource.post({
        firstName,
        lastName,
        email,
        content: message,
      });
      setLoading(false);
      setSuccess('Votre message a bien été envoyé.');
    } catch (e: any) {
      setError(e.message?.replace(errorRegex, '$2'));
      setLoading(false);
    }
    setTimeout(() => {
      setLastName('');
      setFirstName('');
      setEmail('');
      setMessage('');
      setSuccess(null);
      setError(null);
    }, 3000);
  };

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setLastName(value);
    if (value.length < 2) {
      setLastNameError('Le nom doit comporter au moins 2 caractères.');
    } else {
      setLastNameError('');
    }
  };

  const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setFirstName(value);
    if (value.length < 2) {
      setFirstNameError('Le prénom doit comporter au moins 2 caractères.');
    } else {
      setFirstNameError('');
    }
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setEmail(value);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.match(emailRegex)) {
      setEmailError('Veuillez entrer une adresse e-mail valide.');
    } else {
      setEmailError('');
    }
  };

  const handleChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setMessage(value);
    if (value.length < 10) {
      setMessageError('Le message doit comporter au moins 10 caractères.');
    } else {
      setMessageError('');
    }
  };

  const validForm =
    !!firstName &&
    !firstNameError &&
    !!lastName &&
    !lastNameError &&
    !!email &&
    !emailError &&
    !!message &&
    !messageError &&
    status === 'solved';

  return (
    <>
      <Head>
        <title>Nous contacter | Rustine Libre</title>
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
          <Box
            py={4}
            display="flex"
            flexDirection={{xs: 'column', md: 'row'}}
            gap={4}
            position="relative"
            alignItems="flex-start">
            <Box
              justifyContent="center"
              display="flex"
              flexDirection="column"
              alignItems={{xs: 'center', md: 'flex-start'}}
              textAlign={{xs: 'center', md: 'left'}}
              width={{xs: '100%', md: '45%'}}
              mx="auto"
              maxWidth={{xs: '600px', md: '100%'}}>
              <Typography variant="h1" sx={{mb: 4}} color="primary">
                Nous contacter
              </Typography>
              <Typography variant="body1">
                Lorem ipsum ? <br />
                Et harum quidem rerum facilis est et expedita distinctio ?
                <br />
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua ?
                <br />
              </Typography>
              <Typography my={2} variant="h4" color="secondary">
                Lorem ipsum !
              </Typography>
              <Box
                sx={{
                  transform: {
                    xs: 'translateX(-30%)',
                    md: 'translateX(-50%) translateY(20%)',
                    lg: 'translateX(-125%) translateY(20%)',
                  },
                  position: {
                    xs: 'absolute',
                    md: 'static',
                  },
                  left: '0',
                  bottom: '10%',
                }}>
                <img alt="" src="/img/flower.svg" width="110px" />
              </Box>
            </Box>
            <Box
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
                <Grid container item xs={12} spacing={2} direction="row">
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <TextField
                      fullWidth
                      required
                      id="firstName"
                      label="Prénom"
                      name="firstName"
                      autoComplete="firstName"
                      autoFocus
                      value={firstName}
                      error={!!firstName && !!firstNameError}
                      helperText={!!firstName && firstNameError}
                      inputProps={{maxLength: 50}}
                      onChange={handleChangeFirstName}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <TextField
                      fullWidth
                      required
                      id="lastName"
                      label="Nom"
                      name="lastName"
                      autoComplete="lastName"
                      value={lastName}
                      error={!!lastName && !!lastNameError}
                      helperText={!!lastName && lastNameError}
                      inputProps={{maxLength: 50}}
                      onChange={handleChangeLastName}
                    />
                  </Grid>
                </Grid>
                <Grid container item xs={12} spacing={2} direction="column">
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Adresse email"
                      name="email"
                      autoComplete="email"
                      value={email}
                      error={!!email && !!emailError}
                      helperText={!!email && emailError}
                      inputProps={{maxLength: 180}}
                      onChange={handleChangeEmail}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6} md={12} lg={6}>
                    <TextField
                      required
                      fullWidth
                      id="message"
                      label="Message"
                      name="message"
                      multiline
                      rows={5}
                      value={message}
                      error={!!message && !!messageError}
                      helperText={!!message && messageError}
                      onChange={handleChangeMessage}
                    />
                  </Grid>
                </Grid>
                <Grid item xs={12} sm={6} md={12} lg={6} mx="auto" mb={1}>
                  <Turnstile
                    id="widget-1"
                    siteKey={cfTurnstileAPIKey}
                    options={{
                      action: 'submit-form',
                      theme: 'light',
                      language: 'fr',
                      size: isMobile ? 'compact' : 'normal',
                    }}
                    onError={() => setStatus('error')}
                    onExpire={() => setStatus('expired')}
                    onSuccess={() => setStatus('solved')}
                  />
                </Grid>
              </Grid>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button
                  disabled={!validForm}
                  onClick={handleSubmit}
                  variant="contained"
                  size="large"
                  sx={{mt: 2, mx: 'auto'}}>
                  {!loading ? (
                    'Envoyer mon message'
                  ) : (
                    <CircularProgress size={20} sx={{color: 'white'}} />
                  )}
                </Button>
              </Box>
              {success && (
                <Alert color="success" sx={{mt: 2}}>
                  {success}
                </Alert>
              )}
              {error && (
                <Alert color="error" sx={{mt: 2}}>
                  {error}
                </Alert>
              )}
            </Box>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Contact;
