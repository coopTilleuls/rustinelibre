import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Box} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const OurCollective: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Notre collectif</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '70%'}}}>
          <Box sx={{mx: 'auto', mt: 8}}>
            <Typography textAlign={'center'}>
              Contenu en cours de rédaction.
            </Typography>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default OurCollective;
