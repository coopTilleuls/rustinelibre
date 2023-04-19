import React, {ChangeEvent, useContext, useEffect, useState} from "react";
import {validateEmail} from "@utils/emailValidator";
import {validatePassword} from "@utils/passwordValidator";
import TextField from "@mui/material/TextField";
import {useRouter} from 'next/router';
import {UserFormContext} from "@contexts/UserFormContext";
import {User} from "@interfaces/User";
import Box from "@mui/material/Box";

interface UserFormProps {
    user: User|null;
}

export const UserForm = ({user}: UserFormProps): JSX.Element => {

    const router = useRouter();
    const {firstName, setFirstName, lastName, setLastName, email, setEmail, password, passwordError,
        setPasswordError, setPassword, emailError, setEmailError, emailHelperText, setEmailHelperText, passwordInfo, setPasswordInfo} = useContext(UserFormContext);

    useEffect(() => {
        if (user) {
            setFirstName(user.firstName);
            setLastName(user.lastName);
        }
    }, [user, setFirstName, setLastName]);

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

    return (
            <Box sx={{width: '50%'}}>
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
                {
                    !user &&  <TextField
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
                }
                <TextField
                    margin="normal"
                    required
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
            </Box>
    );
};

export default UserForm;
