import React, {ChangeEvent, useContext, useEffect, useState} from 'react';
import {RepairerEmployee} from '@interfaces/RepairerEmployee';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {Alert, CircularProgress, FormControlLabel, Switch} from '@mui/material';
import Container from '@mui/material/Container';
import {useRouter} from 'next/router';
import {repairerEmployeesResource} from '@resources/repairerEmployeesResource';
import {RequestBody} from '@interfaces/Resource';
import {UserFormContext} from '@contexts/UserFormContext';
import {errorRegex} from "@utils/errorRegex";

interface EmployeeFormProps {
  repairerEmployee: RepairerEmployee | null;
}

export const EmployeeForm = ({repairerEmployee}: EmployeeFormProps): JSX.Element => {

  const [enabled, setEnabled] = useState<boolean>(
    repairerEmployee ? repairerEmployee.enabled : true
  );
  const [pendingRegistration, setPendingRegistration] =
    useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
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
    setEmail(repairerEmployee ? repairerEmployee.employee.email : '');
    setFirstName(repairerEmployee ? repairerEmployee.employee.firstName : '');
    setLastName(repairerEmployee ? repairerEmployee.employee.lastName : '');
    setPassword('');
  }, [repairerEmployee, setEmail, setFirstName, setLastName, setPassword]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

    event.preventDefault();
    if (passwordError || !email || !firstName || !lastName) {
      return;
    }

    setErrorMessage(null);
    setPendingRegistration(true);
    const bodyRequest: RequestBody = {
      firstName: firstName,
      lastName: lastName,
      email: email,
    };

    if (password !== '') {
       bodyRequest['plainPassword'] = password;
    }

    try {
      if (repairerEmployee) {
        bodyRequest['enabled'] = enabled;
        await repairerEmployeesResource.updateEmployeeAndUser(
            repairerEmployee['id'],
            bodyRequest
          );
      } else {
        await repairerEmployeesResource.post(bodyRequest);
      }

      setUpdateSuccess(true);
      await router.push('/sradmin/employes');
    } catch (e: any) {
      setErrorMessage(
        `${
          repairerEmployee ? 'Édition impossible' : 'Inscription impossible'
        } : ${e.message?.replace(errorRegex, '$2')}`
      );
    }

    setPendingRegistration(false);
  };

  const handleChangeFirstName = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setFirstName(event.target.value);
  };

  const handleChangeLastName = (event: ChangeEvent<HTMLInputElement>): void => {
    setLastName(event.target.value);
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
        'Le mot de passe doit contenir 12 caractères, une majuscule, un caractère spécial et des chiffres.'
      );
    } else {
      setPasswordError(false);
      setPasswordInfo('');
    }
  };

  const handleChangeEnabled = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnabled(event.target.checked);
  };


  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 3,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
        <Typography component="h1" variant="h5">
          {repairerEmployee ? 'Modifier ce réparateur' : "J'ajoute un réparateur"}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
          <TextField
            autoFocus
            margin="normal"
            required
            fullWidth
            id="firstName"
            label="Prénom"
            name="firstName"
            autoComplete="firstName"
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
            value={lastName}
            inputProps={{ maxLength: 50 }}
            onChange={handleChangeLastName}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={emailError}
            helperText={emailHelperText}
            type={'email'}
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            value={email}
            inputProps={{ maxLength: 180 }}
            onChange={handleChangeEmail}
          />
          <TextField
            required
            margin="normal"
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
          <Typography variant="body1">
            {repairerEmployee
              ? 'Laissez ce champ vide pour conserver le mot de passe actuel'
              : "Si vous ne renseignez pas de mot de passe, l'application en générera un aléatoirement"}
          </Typography>
          {repairerEmployee && (
            <FormControlLabel
              control={
                <Switch checked={enabled} onChange={handleChangeEnabled} />
              }
              label={enabled ? 'Réparateur activé' : 'Réparateur désactivé'}
            />
          )}
          <Button
            type="submit"
            fullWidth
            variant="outlined"
            sx={{mt: 3, mb: 2}}>
            {!pendingRegistration ? (
              repairerEmployee ? (
                'Editer ce réparateur'
              ) : (
                'Ajouter ce réparateur'
              )
            ) : (
              <CircularProgress size={20} />
            )}
          </Button>
          {errorMessage && (
            <Typography variant="body1" color="error">
              {errorMessage}
            </Typography>
          )}

          {updateSuccess && (
            <Alert severity="success">Employé mis à jour</Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default EmployeeForm;
