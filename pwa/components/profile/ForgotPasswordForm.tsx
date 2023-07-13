import React, {ChangeEvent, useState} from 'react';
import {userResource} from '@resources/userResource';
import {
    Box,
    TextField,
    Button,
    CircularProgress,
    Typography, Paper,
} from '@mui/material';
import {errorRegex} from "@utils/errorRegex";


export const ForgotPasswordForm = (): JSX.Element => {
    const [success, setSuccess] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string|null>(null);
    const [pendingSend, setPendingSend] = useState<boolean>(false);
    const [email, setEmail] = useState<string | null>(null);

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ): Promise<void> => {
        event.preventDefault();
        if (!email) {
            return;
        }
        setErrorMessage(null);
        setPendingSend(true);
        try {
            await userResource.forgotPassword({email: email});
            setSuccess(true);
        } catch (e: any) {
            setErrorMessage(e.message?.replace(errorRegex, "$2"));
        }

        setPendingSend(false);
    };

    const handleChangeEmail = (event: ChangeEvent<HTMLInputElement>): void => {
        setEmail(event.target.value);
    };

    return (
        <Box
            component="form"
            width="100%"
            onSubmit={handleSubmit}
            noValidate
            sx={{mt: 1}}>
            {!success && <Box
                p={4}
                sx={{backgroundColor: 'grey.200'}}
                width="100%"
                borderRadius={2}
                maxWidth="lg"
                mx="auto">
                <Typography fontSize={22} fontWeight={600}>
                    Renseignez votre email
                </Typography>
                <Box
                    display="flex"
                    flexDirection={{xs: 'column', md: 'row'}}
                    justifyContent="flex-start"
                    gap={{md: 4}}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        value={email}
                        sx={{backgroundColor: 'white', width: {xs: '100%', md: '40%'}}}
                        inputProps={{maxLength: 50}}
                        onChange={handleChangeEmail}
                    />
                </Box>
                <Box textAlign="left">
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{
                            mt: 3,
                            textTransform: 'capitalize',
                            width: {xs: '100%', md: 'auto'},
                        }}>
                        {!pendingSend ? (
                            'Envoyer'
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
            </Box>}
            {success && <Paper
                elevation={4}
                sx={{
                    maxWidth: 400,
                    p: 4,
                    mt: 4,
                    mb: {xs: 10, md: 12},
                    mx: 'auto',
                    textAlign: 'justify',
                }}>
                <Box>
                    Veuillez consulter vos emails pour mettre à jour votre mot de passe.
                </Box>
            </Paper>}
        </Box>
    );
};

export default ForgotPasswordForm;
