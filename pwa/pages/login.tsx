import {NextPageWithLayout} from 'pages/_app';
import React, {useState, ChangeEvent} from 'react';
import Head from "next/head";
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import {useAuth} from 'contexts/AuthContext';
import {useRouter} from 'next/router';
import {CircularProgress} from "@mui/material";
import WebsiteLayout from "@components/layout/WebsiteLayout";

const Login: NextPageWithLayout = ({}) => {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [pendingLogin, setPendingLogin] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {login} = useAuth();
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();
        setErrorMessage(null);
        setPendingLogin(true);
        const user = await login({
            'email': email,
            'password': password
        });

        if (!!user) {
            await router.push('/');
        } else {
            setErrorMessage(
                "Ces identifiants de connexion ne sont pas valides"
            );
        }

        setPendingLogin(false);
    };

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value)
    };

    const handleChangePassword = (event: ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value)
    };

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Se connecter</title>
                </Head>
                <WebsiteLayout/>
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
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography component="h1" variant="h5">
                                Se connecter
                            </Typography>
                            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Addresse email"
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
                                    {!pendingLogin ? 'Se connecter' : <CircularProgress size={20} />}
                                </Button>
                                {errorMessage && (
                                    <Typography variant="body1" color="error">
                                        {errorMessage}
                                    </Typography>
                                )}
                                <Grid container>
                                    <Grid item xs>
                                        <Link href="#" variant="body2">
                                            Mot de passe oublié ?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="#" variant="body2">
                                            S’inscrire
                                        </Link>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Login;
