import {NextPageWithLayout} from 'pages/_app';
import React, {useState, ChangeEvent, useContext} from 'react';
import Head from "next/head";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useAccount} from '@contexts/AuthContext';
import {useRouter} from 'next/router';
import {CircularProgress} from "@mui/material";
import {userResource} from '@resources/userResource';
import PersonIcon from '@mui/icons-material/Person';
import {validateEmail} from '@utils/emailValidator';
import {validatePassword} from '@utils/passwordValidator';
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {UserFormContext} from "@contexts/UserFormContext";

const Registration: NextPageWithLayout = ({}) => {

    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const user = useAccount({redirectIfFound: '/'});
    const router = useRouter();

    const {firstName, setFirstName, lastName, setLastName, email, setEmail, password, passwordError,
        setPasswordError, setPassword, emailError, setEmailError, emailHelperText, setEmailHelperText, passwordInfo, setPasswordInfo} = useContext(UserFormContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();

        if (passwordError || !email || !password || !firstName || !lastName) {
            return;
        }

        setErrorMessage(null);
        setPendingRegistration(true);

        let newUser;
        try {
            newUser = await userResource.register({
                'firstName': firstName,
                'lastName': lastName,
                'email': email,
                'plainPassword': password,
            })
        } catch (e) {
            setErrorMessage('Inscription impossible');
        }

        if (newUser) {
            await router.push('/login');
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

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Inscription</title>
                </Head>
                <WebsiteLayout />
                <div style={{width: "100vw", marginBottom: '100px'}}>
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
                            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                                <PersonIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Je créé mon compte
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
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="outlined"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    {!pendingRegistration ? 'Créer mon compte' : <CircularProgress size={20} />}
                                </Button>
                                {errorMessage && (
                                    <Typography variant="body1" color="error">
                                        {errorMessage}
                                    </Typography>
                                )}
                                <Grid container>
                                    <Typography variant="body1" color="grey">
                                        En vous inscrivant, vous acceptez les conditions d’utilisation de l’application Bikelib
                                        et sa politique de confidentialité
                                    </Typography>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Registration;
