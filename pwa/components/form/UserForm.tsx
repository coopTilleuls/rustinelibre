import React, {ChangeEvent, useContext, useEffect} from 'react';
import {UserFormContext} from '@contexts/UserFormContext';
import {Box, TextField} from '@mui/material';
import {validateEmail} from '@utils/emailValidator';
import {User} from '@interfaces/User';
import PasswordInput from './input/PasswordInput';

interface UserFormProps {
  user: User | null;
}

export const UserForm = ({user}: UserFormProps): JSX.Element => {
  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    city,
    setCity,
    street,
    setStreet,
    setPassword,
    emailError,
    setEmailError,
    emailHelperText,
    setEmailHelperText,
  } = useContext(UserFormContext);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword('***********');
      setStreet(user.street ? user.street : '');
      setCity(user.city ? user.city : '');
    }
  }, [
    user,
    setFirstName,
    setLastName,
    setEmail,
    setStreet,
    setCity,
    setPassword,
  ]);

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

  const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
    if (!validateEmail(event.target.value)) {
      setEmailError(true);
      setEmailHelperText('Veuillez entrer une adresse email valide.');
    } else {
      setEmailError(false);
      setEmailHelperText('');
    }
  };

  return (
    <Box>
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
        autoFocus
        value={lastName}
        inputProps={{maxLength: 50}}
        onChange={handleChangeLastName}
      />
      {!user && (
        <TextField
          margin="normal"
          required
          fullWidth
          error={emailError}
          helperText={emailHelperText}
          id="email"
          type={'email'}
          label="Email"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          inputProps={{maxLength: 180}}
          onChange={handleChangeEmail}
        />
      )}
      {!user && <PasswordInput />}
      <TextField
        margin="normal"
        fullWidth
        id="address"
        label="Numéro et rue"
        name="street"
        autoComplete="street"
        value={street}
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
        value={city}
        inputProps={{maxLength: 100}}
        onChange={handleChangeCity}
      />
    </Box>
  );
};

export default UserForm;
