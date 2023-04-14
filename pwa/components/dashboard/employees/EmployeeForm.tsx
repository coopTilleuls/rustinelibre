import React, {ChangeEvent, useState} from "react";
import {RepairerEmployee} from "@interfaces/RepairerEmployee";
import {validateEmail} from "@utils/emailValidator";
import {validatePassword} from "@utils/passwordValidator";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {CircularProgress, FormControlLabel, Switch} from "@mui/material";
import Container from "@mui/material/Container";
import {useRouter} from 'next/router';
import {repairerEmployeesResource} from "@resources/repairerEmployeesResource";

interface EmployeeEditFormProps {
    employee: RepairerEmployee|null;
    edit: boolean;
}

export const EmployeeForm = ({employee, edit}: EmployeeEditFormProps): JSX.Element => {

    const [email, setEmail] = useState<string>(employee ? employee.employee.email : '');
    const [password, setPassword] = useState<string>('');
    const [firstName, setFirstName] = useState<string>(employee ? employee.employee.firstName : '');
    const [lastName, setLastName] = useState<string>(employee ? employee.employee.lastName : '');
    const [enabled, setEnabled] = useState<boolean>(employee ? employee.enabled : true);
    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);
    const [emailHelperText, setEmailHelperText] = useState<string>('');
    const [passwordInfo, setPasswordInfo] = useState<string>('');
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (passwordError || !email || !firstName || !lastName) {
            return;
        }

        setErrorMessage(null);
        setPendingRegistration(true);
        let newRepairerEmployee;
        try {
            if (edit && employee) {
                newRepairerEmployee = await repairerEmployeesResource.put(employee['@id'], {
                    'firstName': firstName,
                    'lastName': lastName,
                    'email': email,
                    'plainPassword': password,
                    'enabled': enabled
                })
            } else {
                newRepairerEmployee = await repairerEmployeesResource.post({
                    'firstName': firstName,
                    'lastName': lastName,
                    'email': email,
                    'plainPassword': password,
                })
            }

        } catch (e) {
            setErrorMessage(edit ? 'Édition impossible' : 'Inscription impossible');
        }

        if (newRepairerEmployee) {
            await router.push('/dashboard/employes');
        }

        setPendingRegistration(false);
    };

    const handleChangeFirstName = (event: ChangeEvent<HTMLInputElement>): void => {
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
            setPasswordInfo('Votre mot de passe doit contenir 12 caractères, une majuscule, un caractères et des chiffres.');
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
            <CssBaseline />
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    {edit ? "Modifier ce réparateur" : "J'ajoute un réparateur"}
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                        onChange={handleChangeLastName}
                    />
                    <TextField
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
                        onChange={handleChangeEmail}
                    />
                    <TextField
                        margin="normal"
                        fullWidth
                        error={passwordError}
                        helperText={passwordInfo}
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handleChangePassword}
                    />
                    <Typography variant="body1">
                        {edit ? "Laissez ce champ vide pour conserver le mot de passe actuel" : "Si vous ne renseignez pas de mot de passe, l'application en générera un aléatoirement"}
                    </Typography>
                    {edit && <FormControlLabel control={<Switch checked={enabled} onChange={handleChangeEnabled} />} label={enabled ? "Réparateur activé" : "Réparateur désactivé"} /> }
                    <Button
                        type="submit"
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        {!pendingRegistration ? edit ? 'Editer ce réparateur' : 'Ajouter un réparateur' : <CircularProgress size={20} />}
                    </Button>
                    {errorMessage && (
                        <Typography variant="body1" color="error">
                            {errorMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default EmployeeForm;
