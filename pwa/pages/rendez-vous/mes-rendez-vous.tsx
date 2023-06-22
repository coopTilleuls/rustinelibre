import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {
    Container,
    Typography,
    Paper, Button, Box,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useAccount} from "@contexts/AuthContext";
import MyFutureAppointment from "@components/rendez-vous/MyFutureAppointments";
import MyOldAppointments from "@components/rendez-vous/MyOldAppointments";
import {useRouter} from "next/router";

const MyAppointments: NextPageWithLayout = () => {

    const {user, isLoadingFetchUser} = useAccount({});
    const router = useRouter();

    const handleLogin = () => {
        router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
    };

    return (
        <>
            <Head>
                <title>Mes rendez-vous</title>
            </Head>
            <WebsiteLayout>

                {!user && !isLoadingFetchUser &&
                    <Paper
                        elevation={4}
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            my: 4,
                            p: 4,
                            width: '60%',
                            ml: '20%'
                        }}>
                        <Typography>
                            Connectez-vous pour accéder à la liste de vos rendez-vous
                        </Typography>
                        <Button variant="contained" onClick={handleLogin} sx={{mt: 4}}>
                            Me Connecter
                        </Button>
                    </Paper>
                }

                {
                    user && <Box>
                        <Container sx={{width: {xs: '100%', md: '80%'}}}>
                            <Paper elevation={4} sx={{maxWidth: 1000, p: 4, mt: 4, mx: 'auto'}}>
                                <MyFutureAppointment currentUser={user} future={true} />
                            </Paper>
                        </Container>
                        <Container sx={{width: {xs: '100%', md: '80%'}}}>
                            <Paper elevation={4} sx={{maxWidth: 1000, p: 4, mt: 4, mx: 'auto'}}>
                                <MyOldAppointments currentUser={user} future={false} />
                            </Paper>
                        </Container>
                    </Box>
                }

            </WebsiteLayout>
        </>
    );
};

export default MyAppointments;
