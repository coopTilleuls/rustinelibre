import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useContext, ChangeEvent, useEffect} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {userResource} from '@resources/userResource';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {UserFormContext} from '@contexts/UserFormContext';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import UserForm from '@components/form/UserForm';
import {
  Container,
  Box,
  Button,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Alert,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import {User} from '@interfaces/User';
import {errorRegex} from '@utils/errorRegex';
import {isBoss} from '@helpers/rolesHelpers';

const Registration: NextPageWithLayout = ({}) => {
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [pendingValidation, setPendingValidation] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorMessageValidation, setErrorMessageValidation] = useState<
    string | null
  >(null);
  const [code, setCode] = useState<string>('');
  const {user} = useAccount({});
  const [inscriptionSuccess, setInscriptionSuccess] = useState<boolean>(false);
  const [resendAlert, setResendAlert] = useState<boolean>(false);
  const [resendPending, setResendPending] = useState<boolean>(false);
  const {login, setUser} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.emailConfirmed) {
      const next = Array.isArray(router.query.next)
        ? router.query.next.join('')
        : router.query.next || '/';

      router.push(next);
    } else if (user && !user.emailConfirmed) {
      // Si l'utilisateur est un réparateur, mais que son compte n'a pas encore été validé, on le redirige vers la page de
      // login qui lui affiche un message d'attente de validation
      if (isBoss(user)) {
        router.push('/login');
      } else {
        // Si l'utilisateur est déjà inscrit mais que son mail n'a pas été validé par le code à 4 chiffres, on affiche l'input du code
        setInscriptionSuccess(true);
      }
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const {firstName, lastName, email, password, passwordError, city, street} =
    useContext(UserFormContext);

  const invalidForm =
    !email || !password || passwordError || !firstName || !lastName;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (passwordError || !email || !password || !firstName || !lastName) {
      return;
    }

    setErrorMessage(null);
    setPendingRegistration(true);

    try {
      await userResource.register({
        firstName: firstName,
        lastName: lastName,
        email: email,
        plainPassword: password,
        city: city,
        street: street,
      });

      await login({
        email: email,
        password: password,
      });

      setInscriptionSuccess(true);
    } catch (e: any) {
      setErrorMessage(e.message?.replace(errorRegex, '$2'));
    }

    setPendingRegistration(false);
  };

  const handleChangeCode = (event: ChangeEvent<HTMLInputElement>): void => {
    setCode(event.target.value);
  };

  const handleKeyDown = (event: any): void => {
    if (event.keyCode === 13 && !event.shiftKey && code.length > 0) {
      handleValidCode();
    }
  };

  const handleValidCode = async () => {
    setPendingValidation(true);
    try {
      const userUpdate: User = await userResource.validCode({
        code: parseInt(code),
      });

      setUser(userUpdate);
    } catch (e) {
      setErrorMessageValidation('Code non valide');
    }

    setPendingValidation(false);
  };

  const resendCode = async () => {
    setResendPending(true);
    const response = await userResource.resendValidationCode();
    setResendPending(false);

    if (response) {
      setResendAlert(true);
      setTimeout(() => {
        setResendAlert(false);
      }, 3000);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          {!inscriptionSuccess && (
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
                <Typography
                  textAlign="center"
                  variant="h2"
                  component="h1"
                  color="primary">
                  Créer mon compte
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
                  <Button
                    type="submit"
                    variant="contained"
                    sx={{my: 2}}
                    disabled={invalidForm}>
                    {!pendingRegistration ? (
                      'Créer mon compte'
                    ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                    )}
                  </Button>
                  <Link href="/login" legacyBehavior passHref>
                    <Typography
                      fontSize={14}
                      color="primary"
                      sx={{
                        '&:hover': {
                          cursor: 'pointer',
                          textDecoration: 'underline',
                        },
                      }}
                      pb={2}>
                      J&apos;ai déjà un compte
                    </Typography>
                  </Link>
                  {errorMessage && (
                    <Typography variant="body1" color="error">
                      {errorMessage}
                    </Typography>
                  )}
                </Box>
                <Typography variant="body1" color="grey">
                  En vous inscrivant, vous acceptez les conditions d’utilisation
                  de l’application Rustine libre et sa politique de
                  confidentialité
                </Typography>
              </Box>
            </Paper>
          )}

          {inscriptionSuccess && (
            <Paper
              elevation={4}
              sx={{
                maxWidth: 400,
                p: 4,
                mt: 4,
                mb: {xs: 10, md: 12},
                mx: 'auto',
                textAlign: 'justify',
              }}>
              <Box>
                Veuillez indiquer le code de confirmation envoyé par email pour
                finaliser votre inscription.
                <br />
                <TextField
                  label="Code de validation"
                  value={code}
                  onChange={handleChangeCode}
                  onKeyDown={handleKeyDown}
                  inputProps={{maxLength: 4}}
                  sx={{marginLeft: '15%', marginTop: '20px'}}
                />
                <br />
                <Button
                  disabled={code.length < 4}
                  sx={{marginLeft: '30%', marginTop: '20px'}}
                  variant="contained"
                  color="primary"
                  onClick={handleValidCode}>
                  {pendingValidation ? <CircularProgress /> : 'Valider'}
                </Button>
                {!resendPending && (
                  <Typography
                    onClick={resendCode}
                    variant="subtitle2"
                    color="grey"
                    sx={{marginTop: '20px', cursor: 'pointer'}}>
                    {`Je n'ai pas reçu le code de validation, renvoyer.`}
                  </Typography>
                )}
                {errorMessageValidation && (
                  <Typography variant="body1" color="error">
                    {errorMessageValidation}
                  </Typography>
                )}
              </Box>

              {resendAlert && (
                <Alert sx={{marginTop: '20px'}} severity="info">
                  Code de confirmation renvoyé
                </Alert>
              )}
            </Paper>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Registration;
