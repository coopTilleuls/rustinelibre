import {NextPageWithLayout} from 'pages/_app';
import React, {
} from 'react';
import Head from 'next/head';
import {
    Box,
    Container,
    Button,
    Paper,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Link from "next/link";

const RepairerInscriptionConfirm: NextPageWithLayout = ({}) => {

    return (
        <>
            <Head>
                <title>Demande d'inscription reçue</title>
            </Head>
            <WebsiteLayout />
            <Container sx={{width: {xs: '100%', md: '50%'}}}>
                <Paper
                    elevation={4}
                    sx={{maxWidth: 400, p: 4, mt: 4, mb: {xs: 10, md: 12}, mx: 'auto'}}>
                    <Box>
                        Votre demande d'inscription a bien été enregistrée. Elle est désormais en attente de validation
                        et sera rapidement traitée.

                        <Link href="/">
                            <Button variant="outlined" sx={{marginTop: '30px'}}>
                                Retour à l'accueil
                            </Button>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </>
    );
};


export default RepairerInscriptionConfirm;
