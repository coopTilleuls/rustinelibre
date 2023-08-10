import React, {ChangeEvent, useEffect, useState} from 'react';
import {User} from '@interfaces/User';
import {RequestBody} from '@interfaces/Resource';
import {userResource} from '@resources/userResource';
import {
  Box,
  TextField,
  Alert,
  Button,
  CircularProgress,
  Typography,
  Grid,
} from '@mui/material';
import {errorRegex} from '@utils/errorRegex';

interface MyAccountFormProps {
  userLogged: User;
}

export const MyInformations = ({
  userLogged,
}: MyAccountFormProps): JSX.Element => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
  const [user, setUser] = useState<User>(userLogged);
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [city, setCity] = useState<string>('');
  const [street, setStreet] = useState<string>('');

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    event.preventDefault();
    if (!firstName || !lastName || !user) {
      return;
    }
    setError(false);
    setPendingUpdate(true);
    try {
      const bodyRequest: RequestBody = {
        firstName: firstName,
        lastName: lastName,
        city: city,
        street: street,
      };
      await userResource.putById(user.id, bodyRequest);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (e: any) {
      setError(true);
      setErrorMessage(
        `Mise à jour impossible: ${e.message?.replace(errorRegex, '$2')}`
      );
    }
    setPendingUpdate(false);
  };

  const handleChangeFirstName = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
  };

  const handleChangeStreet = (event: ChangeEvent<HTMLInputElement>): void => {
    setStreet(event.target.value);
  };

  const handleChangeCity = (event: ChangeEvent<HTMLInputElement>): void => {
    setCity(event.target.value);
  };

  const fetchMe = async () => {
    const me = await userResource.getCurrent();
    setUser(me);
    setFirstName(me.firstName);
    setLastName(me.lastName);
    setCity(me.city ?? '');
    setStreet(me.street ?? '');
  };

  useEffect(() => {
    if (userLogged) {
      fetchMe();
    }
  }, [userLogged]); // eslint-disable-line

  return (
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
        <Typography textAlign="center" pb={2} variant="h4" color="secondary">
          Mes informations
        </Typography>
        <Grid container item xs={12} spacing={{xs: 0, md: 2}} direction="row">
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="Prénom"
              name="firstName"
              autoComplete="firstName"
              autoFocus
              value={firstName}
              sx={{
                backgroundColor: 'white',
                borderRadius: 6,
              }}
              inputProps={{maxLength: 50}}
              onChange={handleChangeFirstName}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Nom de famille"
              name="lastName"
              autoComplete="lastName"
              value={lastName}
              sx={{
                backgroundColor: 'white',
                borderRadius: 6,
              }}
              inputProps={{maxLength: 50}}
              onChange={handleChangeLastName}
            />
          </Grid>
        </Grid>
        <Grid container item xs={12} spacing={{xs: 0, md: 2}} direction="row">
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <TextField
              margin="normal"
              fullWidth
              id="address"
              label="Numéro et rue"
              name="street"
              autoComplete="street"
              value={street || user?.street}
              sx={{
                backgroundColor: 'white',
                borderRadius: 6,
              }}
              inputProps={{maxLength: 250}}
              onChange={handleChangeStreet}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={12} lg={6}>
            <TextField
              margin="normal"
              fullWidth
              id="city"
              label="Ville"
              name="city"
              autoComplete="city"
              value={city || user?.city}
              sx={{
                backgroundColor: 'white',
                borderRadius: 6,
              }}
              inputProps={{maxLength: 100}}
              onChange={handleChangeCity}
            />
          </Grid>
        </Grid>
      </Grid>
      <Box display="flex" flexDirection="column" alignItems="center">
        <Button
          disabled={pendingUpdate}
          type="submit"
          variant="contained"
          size="large"
          sx={{mt: 2, width: 'content-fit'}}>
          {!pendingUpdate ? (
            'Envoyer '
          ) : (
            <CircularProgress size={20} sx={{color: 'white'}} />
          )}
        </Button>
        {error && (
          <Alert sx={{width: '100%', mt: 4}} severity="error">
            {errorMessage}
          </Alert>
        )}
        {success && (
          <Alert sx={{width: '100%', mt: 4}} severity="success">
            Compte mis à jour
          </Alert>
        )}
      </Box>
    </Box>
  );
};

export default MyInformations;
