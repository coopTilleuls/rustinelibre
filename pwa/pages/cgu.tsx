import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Paper, Avatar, Box} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import CGU from '@components/cgu/CGU';

const Cgu: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>CGU | Rustine Libre</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          <Box display="flex" flexDirection="column" gap={8} py={4}>
            <Typography variant="h1" color="primary" textAlign="center">
              Conditions Générales d&apos;Utilisation
            </Typography>
            <CGU />
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Cgu;
