import {NextPageWithLayout} from 'pages/_app';
import React, {useState, ChangeEvent, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {useAccount, useAuth} from 'contexts/AuthContext';
import {
  Container,
  Box,
  Avatar,
  Typography,
  TextField,
  Link,
  Button,
  CircularProgress,
  Paper,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {isAdmin, isBoss, isEmployee} from '@helpers/rolesHelpers';

const Login: NextPageWithLayout = ({}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pendingLogin, setPendingLogin] = useState<boolean>(false);
  const [repairerWaitingValidation, setRepairerWaitingValidation] =
    useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {user} = useAccount({});
  const {login} = useAuth();
  const router = useRouter();
  const next = Array.isArray(router.query.next)
    ? router.query.next.join('')
    : router.query.next || '/';

  useEffect(() => {
    // Si l'utilisateur est connecté et son mail validé.
    if (user && user.emailConfirmed) {
      // Si c'est un compte réparateur on le redirige vers son back office
      if (isBoss(user) || isEmployee(user)) {
        router.push('/sradmin');
      } else if (isAdmin(user)) {
        router.push('/admin/reparateurs');
      } else {
        router.push(next);
      }
      // Si le compte n'a pas encore validé son email
    } else if (user && !user.emailConfirmed) {
      // Si c'est un compte réparateur, on lui affiche un message indiquant que son compte est en attente
      if (isBoss(user) || isEmployee(user)) {
        setRepairerWaitingValidation(true);
      } else {
        router.push(`/inscription`);
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPendingLogin(true);

    const connectionSuccess = await login({
      email: email,
      password: password,
    });

    if (!connectionSuccess) {
      setErrorMessage('Ces identifiants de connexion ne sont pas valides');
    }

    setPendingLogin(false);
  };

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  return (
    <>
      <Head>
        <title>Se connecter | Rustine Libre</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          {!repairerWaitingValidation && (
            <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}>
                <Avatar sx={{m: 1, backgroundColor: 'primary.main'}}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h2" component="h1" color="primary">
                  Se connecter
                </Typography>
                <Box
                  component="form"
                  onSubmit={handleSubmit}
                  noValidate
                  sx={{mt: 1}}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    type={'email'}
                    id="email"
                    label="Adresse email"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    value={email}
                    inputProps={{maxLength: 180}}
                    onChange={handleChangeEmail}
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Mot de passe"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={handleChangePassword}
                  />
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center">
                    <Button type="submit" variant="contained" sx={{my: 2}}>
                      {!pendingLogin ? (
                        'Se connecter'
                      ) : (
                        <CircularProgress size={20} sx={{color: 'white'}} />
                      )}
                    </Button>
                    {errorMessage && (
                      <Typography variant="body1" color="error">
                        {errorMessage}
                      </Typography>
                    )}
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      width="100%">
                      <Link href="/mot-de-passe-oublie" variant="body2">
                        Mot de passe oublié ?
                      </Link>
                      <Link href="/inscription" variant="body2">
                        S’inscrire
                      </Link>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          )}
          {repairerWaitingValidation && (
            <Paper
              elevation={4}
              sx={{
                maxWidth: 400,
                p: 4,
                mt: 4,
                mb: {xs: 10, md: 12},
                mx: 'auto',
              }}>
              <Box>
                Votre demande d&apos;inscription est encore en attente de
                validation.
              </Box>
            </Paper>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Login;
