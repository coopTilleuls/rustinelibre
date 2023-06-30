import React, {useState, ChangeEvent, useEffect} from 'react';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {userResource} from '@resources/userResource';
import {validatePassword} from '@utils/passwordValidator';
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import {authenticationResource} from "@resources/authenticationResource";

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
  const {login} = useAuth();

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
      setErrorMessage('Ce mot de passe n\'est pas valide');
    }

    setPendingLogin(false);
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
    if (checkPassword == newPassword) {
      try {
        await userResource.putById(user.id, {
          email: user.email,
          plainPassword: newPassword,
        });
        setSuccessNewPassword(true);
        setTimeout(() => {
          setSuccessNewPassword(false);
          setOldPassword('');
        }, 3000);
        setSuccessOldPassword(false);
      } catch (e:any) {
        setErrorMessage(e.message?.replace(/^\w+:\s(.*)/g, "$1"));
        setSuccessOldPassword(false);
      }
    } else {
      setErrorMessage('Les mots de passe doivent être identiques');
    }
    setPendingLogin(false);
  };

  return (
    <Box
      mt={8}
      p={4}
      sx={{backgroundColor: 'grey.200'}}
      width="100%"
      borderRadius={2}
      maxWidth="lg"
      mx="auto">
      <Typography fontSize={22} fontWeight={600}>
        Modifier mot de passe
      </Typography>
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
          display="flex"
          flexDirection="column"
          width={{xs: '100%', md: '40%'}}>
          <TextField
            sx={{backgroundColor: 'white', width: '100%'}}
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
          {!successOldPassword && (
            <Box display="flex" flexDirection="column" alignItems="start">
              <Button
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  textTransform: 'capitalize',
                  width: {xs: '100%', md: 'auto'},
                }}>
                {!pendingLogin ? (
                  'Confirmer'
                ) : (
                  <CircularProgress size={20} sx={{color: 'white'}} />
                )}
              </Button>
            </Box>
          )}
        </Box>
        <Box
          sx={{backgroundColor: 'white', width: '40%', visibility: 'hidden'}}
        />
      </Box>

      {successOldPassword && (
        <Box component="form" onSubmit={handleUpdatePassword} noValidate>
          <Box
            display="flex"
            flexDirection={{xs: 'column', md: 'row'}}
            justifyContent="flex-end"
            gap={{md: 4}}
            mt={1}>
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
              sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
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
              sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
            />
          </Box>
          <Box textAlign="right">
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                textTransform: 'none',
                width: {xs: '100%', md: 'auto'},
              }}>
              {!pendingLogin ? (
                'Mettre à jour'
              ) : (
                <CircularProgress size={20} sx={{color: 'white'}} />
              )}
            </Button>
          </Box>
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
