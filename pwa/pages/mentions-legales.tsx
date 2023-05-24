import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {
    Container,
    Typography,
    Paper,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const LegalNotice: NextPageWithLayout = () => {
    return (
        <>
            <Head>
                <title>FAQ</title>
            </Head>
            <WebsiteLayout>
                <Container sx={{width: {xs: '100%', md: '70%'}}}>
                    <Paper elevation={4} sx={{maxWidth: 800, p: 4, mt: 4, mx: 'auto'}}>

                        <Typography variant={"body1"}>
                            Le site &#34;La rustine libre&#34; est édité par la société Les-Tilleuls.coop, société coopérative ouvrière de production,
                            immatriculée au Registre du Commerce et des Sociétés sous le numéro XXXXXXXX.

                            <br /><br />
                            Siège social : XX Rue des Tilleuls, XXXXX Ville, France.
                            <br /><br />
                            Responsable de la publication : [Nom du responsable], [Fonction], Les-Tilleuls.coop.
                            <br /><br />
                            Contact :
                        </Typography>
                        <ul>
                            <li>
                                Adresse e-mail : contact@larustinelibre.fr
                            </li>
                            <li>
                                Numéro de téléphone : XX-XX-XX-XX-XX
                            </li>
                            <li>
                                Adresse e-mail : contact@larustinelibre.fr
                            </li>
                        </ul>
                    </Paper>
                </Container>
            </WebsiteLayout>
        </>
    );
};

export default LegalNotice;
