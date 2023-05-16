import {NextPageWithLayout} from 'pages/_app';
import React, {useState, ChangeEvent} from 'react';
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

const Login: NextPageWithLayout = ({}) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [pendingLogin, setPendingLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const {user} = useAccount({redirectIfFound: '/'});
  const {login} = useAuth();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);
    setPendingLogin(true);

    const connectionSuccess = await login({
      email: email,
      password: password,
    });

    if (connectionSuccess) {
      const next = Array.isArray(router.query.next)
        ? router.query.next.join('')
        : router.query.next || '/';

      router.push(next);
    } else {
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
        <title>Se connecter</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
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
              <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
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
                  id="email"
                  label="Adresse email"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={email}
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
                <Box display="flex" flexDirection="column" alignItems="center">
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
                    <Link href="#" variant="body2">
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
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Login;
