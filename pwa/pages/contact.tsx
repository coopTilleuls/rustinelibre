import {NextPageWithLayout} from 'pages/_app';
import React, {ChangeEvent, useState} from 'react';
import Head from 'next/head';
import {contactResource} from '@resources/ContactResource';
import {Turnstile} from '@marsidev/react-turnstile';
import {
  Container,
  Typography,
  Paper,
  Avatar,
  Box,
  Button,
  TextField,
  Alert,
  CircularProgress,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import {errorRegex} from '@utils/errorRegex';

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
  const [error, setError] = useState<string>('');

  const [isValid, setIsValid] = useState<boolean>(false);
  const [status, setStatus] = useState<Status | null>(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await contactResource.post({
        firstName,
        lastName,
        email,
        content: message,
      });
      setLoading(false);
      setIsValid(true);
      setTimeout(() => {
        setLastName('');
        setFirstName('');
        setEmail('');
        setMessage('');
        setIsValid(false);
      }, 3000);
    } catch (e: any) {
      setError(e.message?.replace(errorRegex, '$2'));
      setLoading(false);
    }
  };

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setIsValid(false);
    setLastName(value);
    if (value.length < 2) {
      setLastNameError('Le nom doit comporter au moins 2 caractères.');
    } else {
      setLastNameError('');
    }
  };

  const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setIsValid(false);
    setFirstName(value);

    if (value.length < 2) {
      setFirstNameError('Le prénom doit comporter au moins 2 caractères.');
    } else {
      setFirstNameError('');
    }
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    const {value} = event.target;
    setIsValid(false);
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
    setIsValid(false);
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
        <title>Nous contacter</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          <Paper elevation={4} sx={{maxWidth: 400, p: 4, my: 4, mx: 'auto'}}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <Avatar sx={{m: 1, backgroundColor: 'primary.main'}}>
                <ContactSupportIcon />
              </Avatar>
              <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
                Nous contacter
              </Typography>
              <Box component="form" noValidate sx={{mt: 1}}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="lastName"
                  value={lastName}
                  error={!!lastName && !!lastNameError}
                  helperText={!!lastName && lastNameError}
                  onChange={handleChangeLastName}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  name="firstName"
                  autoComplete="firstName"
                  value={firstName}
                  error={!!firstName && !!firstNameError}
                  helperText={!!firstName && firstNameError}
                  onChange={handleChangeFirstName}
                />
                <TextField
                  margin="normal"
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
                <TextField
                  margin="normal"
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
                <Box mt={2} display="flex" justifyContent="center" width="100%">
                  <Turnstile
                    id="widget-1"
                    siteKey={cfTurnstileAPIKey}
                    options={{
                      action: 'submit-form',
                      theme: 'light',
                      language: 'fr',
                    }}
                    onError={() => setStatus('error')}
                    onExpire={() => setStatus('expired')}
                    onSuccess={() => setStatus('solved')}
                  />
                </Box>
                <Button
                  onClick={handleSubmit}
                  sx={{mt: 3}}
                  fullWidth
                  disabled={!validForm}
                  variant="contained">
                  {!loading ? 'Valider' : <CircularProgress />}
                </Button>
                {error && (
                  <Alert severity="error" sx={{mt: 3}}>
                    {error}
                  </Alert>
                )}
                {isValid && (
                  <Alert severity="success" sx={{mt: 3}}>
                    Message envoyé avec succès !
                  </Alert>
                )}
              </Box>
            </Box>
          </Paper>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Contact;
