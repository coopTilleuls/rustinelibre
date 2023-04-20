import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from "next/head";
import WebsiteLayout from "@components/layout/WebsiteLayout";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {Alert, CircularProgress} from "@mui/material";
import {useAccount} from "@contexts/AuthContext";
import {UserFormContext} from "@contexts/UserFormContext";
import {userResource} from "@resources/userResource";
import UserForm from "@components/profile/UserForm";
import {RequestBody} from "@interfaces/Resource";

const MyProfile: NextPageWithLayout = () => {

    const user = useAccount({redirectIfNotFound: '/login'});
    const [success, setSuccess] = useState<boolean>(false);
    const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {firstName, lastName, email, password, passwordError} = useContext(UserFormContext);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {

        event.preventDefault();
        if (passwordError || !firstName || !lastName || !user) {
            return;
        }

        setErrorMessage(null);
        setPendingUpdate(true);

        let newUser;
        try {
            const bodyRequest: RequestBody = {
                'firstName': firstName,
                'lastName': lastName,
            };
            if (password && password !== '') {
                bodyRequest['plainPassword'] = password;
            }
            newUser = await userResource.putById(user.id, bodyRequest)
        } catch (e) {
            setErrorMessage('Mise à jour impossible');
        }

        if (newUser) {
            setSuccess(true);
            setTimeout(() => {setSuccess(false);}, 3000);
        }

        setPendingUpdate(false);
    };

    return (
        <>
            <div style={{width: "100vw", overflowX: "hidden"}}>
                <Head>
                    <title>Mon profil</title>
                </Head>
                <WebsiteLayout />
                <main>
                    <Box
                        sx={{
                            bgcolor: 'background.paper',
                            paddingTop: 8,
                            marginLeft: '10%',
                        }}
                    >
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <UserForm user={user} />
                            <Button
                                type="submit"
                                fullWidth
                                variant="outlined"
                                sx={{ mt: 3, mb: 2, width: '50%' }}
                            >
                                {!pendingUpdate ? 'Mettre à jour mon profil' : <CircularProgress size={20} />}
                            </Button>
                            {errorMessage && (
                                <Typography variant="body1" color="error">
                                    {errorMessage}
                                </Typography>
                            )}
                            {success && <Alert sx={{width: '50%'}} severity="success">Profil mis à jour</Alert>}
                        </Box>
                    </Box>
                </main>
            </div>
        </>
    );
};

export default MyProfile;
