import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import TextField from '@mui/material/TextField';
import {UserFormContext} from '@contexts/UserFormContext';
import {User} from '@interfaces/User';
import Box from '@mui/material/Box';

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
    password,
    passwordError,
    setPasswordError,
    setPassword,
    emailError,
    setEmailError,
    emailHelperText,
    setEmailHelperText,
    passwordInfo,
    setPasswordInfo,
  } = useContext(UserFormContext);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setPassword('***********')
      setStreet(user.street ? user.street : '');
      setCity(user.city ? user.city : '');
    }
  }, [user, setFirstName, setLastName, setEmail, setStreet, setCity]);

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

  const handleChangePassword = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
    if (!validatePassword(event.target.value)) {
      setPasswordError(true);
      setPasswordInfo(
        'Votre mot de passe doit contenir 12 caractères, une majuscule, un caractère spécial et des chiffres.'
      );
    } else {
      setPasswordError(false);
      setPasswordInfo('');
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
        inputProps={{ maxLength: 50 }}
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
        inputProps={{ maxLength: 50 }}
        onChange={handleChangeLastName}
      />
      {!user && <TextField
        margin="normal"
        required
        fullWidth
        error={emailError}
        helperText={emailHelperText}
        id="email"
        label="Email"
        name="email"
        autoComplete="email"
        autoFocus
        value={email}
        inputProps={{ maxLength: 180 }}
        onChange={handleChangeEmail}
      />}
      {!user && <TextField
          margin="normal"
          required
          fullWidth
          error={passwordError}
          helperText={passwordInfo}
          name="password"
          label="Mot de passe"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={handleChangePassword}
      />
      }
      <TextField
          margin="normal"
          fullWidth
          id="address"
          label="Numéro et rue"
          name="street"
          autoComplete="street"
          value={street}
          inputProps={{ maxLength: 250 }}
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
          inputProps={{ maxLength: 100 }}
          onChange={handleChangeCity}
      />
    </Box>
  );
};

export default UserForm;
