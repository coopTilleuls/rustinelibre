import React, {useState, ChangeEvent, useEffect} from 'react';
import {useAccount} from '@contexts/AuthContext';
import {authenticationResource} from '@resources/authenticationResource';
import {userResource} from '@resources/userResource';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {validatePassword} from '@utils/passwordValidator';

const UpdatePassword = (): JSX.Element => {
  const {user} = useAccount({redirectIfNotFound: '/login'});
  const [successOldPassword, setSuccessOldPassword] = useState<boolean>(false);
  const [successNewPassword, setSuccessNewPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');
  const [pendingLogin, setPendingLogin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [passwordErrorText, setPasswordErrorText] = useState<string | null>(
    null
  );
  const [checkPasswordErrorText, setCheckPasswordErrorText] = useState<
    string | null
  >(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    setErrorMessage(null);
    setPendingLogin(true);
    const response = await authenticationResource.checkCurrentPassword({
      email: email,
      password: oldPassword,
    });
    if (response.ok) {
      setSuccessOldPassword(true);
    } else {
      setErrorMessage("Ce mot de passe n'est pas valide.");
    }
    setPendingLogin(false);
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  };
  useEffect(() => {
    if (user) {
      setEmail(user.email);
    }
  }, [user, setEmail]);

  const handleChangeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
    setOldPassword(event.target.value);
  };

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

  const handleUpdatePassword = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    if (!user) {
      return;
    }
    setErrorMessage(null);
    setPendingLogin(true);
    if (newPassword === '') {
      setErrorMessage('Le nouveau mot de passe ne peut pas être vide.');
      setPendingLogin(false);
      return;
    }
    if (checkPassword === newPassword) {
      try {
        await userResource.putById(user.id, {
          email: user.email,
          plainPassword: newPassword,
        });
        setSuccessNewPassword(true);
        setOldPassword('');
        setTimeout(() => {
          setSuccessNewPassword(false);
          setCheckPassword('');
          setNewPassword('');
        }, 3000);
        setSuccessOldPassword(false);
      } catch (e: any) {
        setErrorMessage(e.message?.replace(/(\w+):\s(.*?)(?=\n\w+:|$)/g, '$2'));
        setSuccessOldPassword(false);
      }
    } else {
      setErrorMessage('Les mots de passe doivent être identiques');
    }
    setPendingLogin(false);
  };

  return (
    <Box
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
      <Box onSubmit={handleSubmit} component="form" noValidate>
        <Grid container direction="column">
          <Typography textAlign="center" pb={2} variant="h4" color="secondary">
            Modifier mot de passe
          </Typography>
          <Grid container item xs={12} spacing={{xs: 0, md: 2}} direction="row">
            <Grid item xs={12} sm={6} md={12} lg={6}>
              <TextField
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  width: '100%',
                }}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Mot de passe actuel"
                type="password"
                id="password"
                autoComplete="current-password"
                value={oldPassword}
                onChange={handleChangeOldPassword}
              />
            </Grid>
            {!successOldPassword && (
              <Grid item xs={12} sm={6} md={12} lg={6}>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems={{xs: 'center', md: 'end'}}>
                  <Button
                    disabled={!oldPassword}
                    size="large"
                    type="submit"
                    variant="contained"
                    sx={{
                      mt: 3,
                      textTransform: 'capitalize',
                    }}>
                    {!pendingLogin ? (
                      'Confirmer'
                    ) : (
                      <CircularProgress size={20} sx={{color: 'white'}} />
                    )}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Grid>
      </Box>
      {successOldPassword && (
        <Box component="form" onSubmit={handleUpdatePassword} noValidate>
          <Grid container direction="column">
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
                    borderRadius: '20px',
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
                    borderRadius: '20px',
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={12} lg={6}>
              <Box display="flex" flexDirection="column" alignItems="center">
                <Button
                  size="large"
                  type="submit"
                  variant="contained"
                  sx={{
                    mx: 'auto',
                    mt: 3,
                    textTransform: 'none',
                  }}>
                  {!pendingLogin ? (
                    'Mettre à jour'
                  ) : (
                    <CircularProgress size={20} sx={{color: 'white'}} />
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      )}
      {errorMessage && (
        <Alert sx={{width: '100%', mt: 4}} severity="error">
          {errorMessage}
        </Alert>
      )}
      {successNewPassword && (
        <Alert sx={{width: '100%', mt: 4}} severity="success">
          Mot de passe mis à jour !
        </Alert>
      )}
    </Box>
  );
};

export default UpdatePassword;
