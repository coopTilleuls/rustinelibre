import {NextPageWithLayout} from 'pages/_app';
import React, {useState, useEffect, useContext} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useRouter} from 'next/router';
import {Alert, Button, CircularProgress, Typography} from '@mui/material';
import UserForm from "@components/profile/UserForm";
import {User} from "@interfaces/User";
import {userResource} from "@resources/userResource";
import AdminLayout from "@components/admin/AdminLayout";
import {RequestBody} from "@interfaces/Resource";
import {UserFormContext} from "@contexts/UserFormContext";

const EditUser: NextPageWithLayout = () => {

    const router = useRouter();
    const {id} = router.query;
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);
    const [pendingUpdate, setPendingUpdate] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {firstName, lastName, passwordError, city, street} = useContext(UserFormContext);

    useEffect(() => {
        async function fetchUser() {
            if (typeof id === 'string' && id.length > 0) {
                setLoading(true);
                const userFetch: User = await userResource.getById(id);
                setUser(userFetch);
                setLoading(false);
            }
        }
        if (id) {
            fetchUser();
        }
    }, [id]);

    const updateUser = async (): Promise<void> => {
        if (!firstName || !lastName || !user) {
            return;
        }

        setErrorMessage(null);
        setPendingUpdate(true);

        try {
            const bodyRequest: RequestBody = {
                firstName: firstName,
                lastName: lastName,
                city: city,
                street: street,
            };
            await userResource.putById(user.id, bodyRequest);
            setSuccess(true);
            setTimeout(() => {setSuccess(false)}, 3000);
        } catch (e) {
            setErrorMessage('Mise à jour impossible');
        }

        setPendingUpdate(false);
    };

    return (
        <>
            <Head>
                <title>Éditer un utilisateur</title>
            </Head>
            <AdminLayout />
            <Box
                component="main"
                sx={{marginLeft: '20%', marginRight: '5%'}}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <UserForm user={user} />
                )}
            </Box>

            <Box
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Button
                    onClick={updateUser}
                    fullWidth
                    variant="contained"
                    sx={{mt: 3, mb: 2, width: '50%'}}>
                    {!pendingUpdate ? (
                        'Enregistrer'
                    ) : (
                        <CircularProgress size={20} sx={{color: 'white'}} />
                    )}
                </Button>

                {errorMessage && (
                    <Typography variant="body1" color="error">
                        {errorMessage}
                    </Typography>
                )}
                {success && (
                    <Alert sx={{width: '50%', marginLeft: '5%'}} severity="success">
                        Utilisateur mis à jour
                    </Alert>
                )}
            </Box>
        </>
    );
};

export default EditUser;
