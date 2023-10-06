import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {UserFormContext} from '@contexts/UserFormContext';
import {Box, TextField, IconButton, InputAdornment} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import {User} from '@interfaces/User';

export const PasswordInput = (): JSX.Element => {
  const {
    password,
    passwordError,
    setPasswordError,
    setPassword,
    passwordInfo,
    setPasswordInfo,
  } = useContext(UserFormContext);

  const [passwordShown, setPasswordShown] = useState(false);

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

  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };

  return (
    <TextField
      margin="normal"
      required
      fullWidth
      error={passwordError}
      helperText={passwordInfo}
      name="password"
      label="Mot de passe"
      type={passwordShown ? 'text' : 'password'}
      id="password"
      autoComplete="current-password"
      value={password}
      onChange={handleChangePassword}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} color="secondary">
              {passwordShown ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
