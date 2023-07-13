import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Paper} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const PrivacyPolicy: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Protection des données</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '70%'}}}>
          <Paper elevation={4} sx={{maxWidth: 800, p: 4, mt: 4, mx: 'auto'}}>
            <Typography variant="body1" textAlign="center">
              Contenu en cours de rédaction
            </Typography>
          </Paper>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default PrivacyPolicy;
