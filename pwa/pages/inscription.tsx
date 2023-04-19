import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useContext} from 'react';
import Head from "next/head";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import {useAccount} from '@contexts/AuthContext';
import {useRouter} from 'next/router';
import {CircularProgress} from "@mui/material";
import {userResource} from '@resources/userResource';
import PersonIcon from '@mui/icons-material/Person';
import WebsiteLayout from "@components/layout/WebsiteLayout";
import {UserFormContext} from "@contexts/UserFormContext";
import UserForm from "@components/profile/UserForm";

const Registration: NextPageWithLayout = ({}) => {

    const [pendingRegistration, setPendingRegistration] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const user = useAccount({redirectIfFound: '/'});
    const router = useRouter();

    const {firstName, lastName, email, password, passwordError} = useContext(UserFormContext);

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
                                <UserForm user={null} />
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
