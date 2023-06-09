import React, {useState, ChangeEvent, useContext, useEffect} from 'react';
import Head from 'next/head';
import {useAccount, useAuth} from '@contexts/AuthContext';
import {
    Container,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    CircularProgress,
    Paper, Alert,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {RequestBody} from "@interfaces/Resource";
import {userResource} from "@resources/userResource";
import {UserFormContext} from "@contexts/UserFormContext";

type ChangePasswordProps ={

};
const Login= ({

              }: ChangePasswordProps): JSX.Element => {
    const {user, isLoadingFetchUser} = useAccount({redirectIfNotFound: '/login'});
    const [successOldPassword, setSuccessOldPassword] = useState<boolean>(false);
    const [successNewPassword, setSuccessNewPassword] = useState<boolean>(false);
    const [email, setEmail] = useState<string>('');
    const [oldPassword, setOldPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [checkPassword, setCheckPassword] = useState<string>('');
    const [pendingLogin, setPendingLogin] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {password} = useContext(UserFormContext);
    const {login} = useAuth();


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) {
            return;
        }
        setErrorMessage(null);
        setPendingLogin(true);

        const connectionSuccess = await login({
            email: email,
            password: oldPassword,
        });

        if (connectionSuccess) {
            setSuccessOldPassword(true);
        } else {
            setErrorMessage('Ces identifiants de connexion ne sont pas valides');
        }

        setPendingLogin(false);
    };


    useEffect(() => {
        if (user) {
            setEmail(user.email);
        }
    }, [user, setEmail]);

    const handleChangeOldPassword = (event: ChangeEvent<HTMLInputElement>) => {
        setOldPassword(event.target.value);
    };
    const handleChangeNewPassword = (event: ChangeEvent<HTMLInputElement>) => {
        setNewPassword(event.target.value);
    };
    const handleChangeCheckPassword = (event: ChangeEvent<HTMLInputElement>) => {
        setCheckPassword(event.target.value);
    };

    const handleUpdatePassword = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) {
            return;
        }
        setErrorMessage(null);
        setPendingLogin(true);
        if(checkPassword == newPassword){
            try {
                const bodyRequest: RequestBody = {
                    plainPassword: newPassword,
                };
                await userResource.putById(user.id, bodyRequest);

                setSuccessNewPassword(true);
                setTimeout(() => {
                    setSuccessNewPassword(false);
                }, 3000);
            } catch (e) {
                setErrorMessage('Mise à jour impossible');
            }
        }
        else{
            setErrorMessage('Les mots de passe doivent être identiques');
        }

        setPendingLogin(false);

    }
    return (
        <>
            <Head>
                <title>Modifier mot de passe</title>
            </Head>
            <WebsiteLayout>
                <Container sx={{width: {xs: '100%', md: '50%'}}}>
                    <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
                        <Box
                            sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}>
                            <Avatar sx={{m: 1, backgroundColor: 'primary.main'}}>
                                <LockOutlinedIcon />
                            </Avatar>
                            <Typography fontSize={{xs: 28, md: 30}} fontWeight={600}>
                                Modifier mot de passe
                            </Typography>
                            <Box
                                component="form"
                                onSubmit={handleSubmit}
                                noValidate
                                sx={{mt: 1}}>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Mot de passe actuel"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={oldPassword}
                                    onChange={handleChangeOldPassword}
                                />

                                {!successOldPassword &&
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Button type="submit" variant="contained" sx={{my: 2}}>
                                            {!pendingLogin ? (
                                                'Confirmer le mot de passe actuel'
                                            ) : (
                                                <CircularProgress size={20} sx={{color: 'white'}} />
                                            )}
                                        </Button>
                                        {errorMessage && (
                                            <Typography variant="body1" color="error">
                                                {errorMessage}
                                            </Typography>
                                        )}
                                    </Box>
                                }
                            </Box>

                            {successOldPassword &&
                                <Box
                                    component="form"
                                    onSubmit={handleUpdatePassword}
                                    noValidate
                                    sx={{mt: 1}}>

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="newPassword"
                                        label="Nouveau mot de passe"
                                        type="password"
                                        id="newPassword"
                                        value={newPassword}
                                        onChange={handleChangeNewPassword}
                                    />

                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        name="checkPassword"
                                        label="Confirmer le mot de passe"
                                        type="password"
                                        id="checkPassword"
                                        value={checkPassword}
                                        onChange={handleChangeCheckPassword}
                                    />
                                    <Box display="flex" flexDirection="column" alignItems="center">
                                        <Button type="submit" variant="contained" sx={{my: 2}}>
                                            {!pendingLogin ? (
                                                'Mettre à jour mon mot de passe'
                                            ) : (
                                                <CircularProgress size={20} sx={{color: 'white'}} />
                                            )}
                                        </Button>
                                        {errorMessage && (
                                            <Typography variant="body1" color="error">
                                                {errorMessage}
                                            </Typography>
                                        )}
                                    </Box>
                                </Box>
                            }
                            {successNewPassword && (
                                <Alert sx={{width: '100%'}} severity="success">
                                    Mot de passe mis à jour
                                </Alert>
                            )}
                        </Box>
                    </Paper>
                </Container>
            </WebsiteLayout>
        </>
    );
};

export default Login;
