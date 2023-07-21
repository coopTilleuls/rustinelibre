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
} from '@mui/material';
import {errorRegex} from '@utils/errorRegex';
import {isAdmin} from '@helpers/rolesHelpers';

interface MyAccountFormProps {
  userLogged: User;
}

export const MyAccountForm = ({
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
    setCity(me.city ? me.city : '');
    setStreet(me.street ? me.street : '');
  };

  useEffect(() => {
    if (userLogged) {
      fetchMe();
    }
  }, [userLogged]); // eslint-disable-line

  return (
    <Box
      component="form"
      width="100%"
      onSubmit={handleSubmit}
      noValidate
      sx={{mt: 1}}>
      <Box
        p={4}
        sx={{backgroundColor: 'grey.200'}}
        width="100%"
        borderRadius={2}
        maxWidth="lg"
        mx="auto">
        <Typography fontSize={22} fontWeight={600}>
          Mes informations
        </Typography>
        <Box
          display="flex"
          flexDirection={{xs: 'column', md: 'row'}}
          justifyContent="flex-end"
          gap={{md: 4}}>
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
            sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
            inputProps={{maxLength: 50}}
            onChange={handleChangeFirstName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="lastName"
            label="Nom de famille"
            name="lastName"
            autoComplete="lastName"
            value={lastName}
            sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
            inputProps={{maxLength: 50}}
            onChange={handleChangeLastName}
          />
        </Box>
        <Box
          display="flex"
          flexDirection={{xs: 'column', md: 'row'}}
          justifyContent="flex-end"
          gap={{md: 4}}>
          <TextField
            margin="normal"
            fullWidth
            id="address"
            label="Numéro et rue"
            name="street"
            autoComplete="street"
            value={street || user?.street}
            sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
            inputProps={{maxLength: 250}}
            onChange={handleChangeStreet}
          />
          <TextField
            margin="normal"
            fullWidth
            id="city"
            label="Ville"
            name="city"
            autoComplete="city"
            value={city || user?.city}
            sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
            inputProps={{maxLength: 100}}
            onChange={handleChangeCity}
          />
        </Box>
        <Box textAlign="right">
          <Button
            type="submit"
            variant="contained"
            sx={{
              mt: 3,
              textTransform: 'capitalize',
              width: {xs: '100%', md: 'auto'},
            }}>
            {!pendingUpdate ? (
              'Enregistrer'
            ) : (
              <CircularProgress size={20} sx={{color: 'white'}} />
            )}
          </Button>
        </Box>
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

export default MyAccountForm;
