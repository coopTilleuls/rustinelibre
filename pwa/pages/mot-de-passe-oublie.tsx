import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Typography, Box, CircularProgress, Container} from '@mui/material';
import {useAccount} from '@contexts/AuthContext';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import ForgotPasswordForm from '@components/profile/ForgotPasswordForm';

const ForgotPassword: NextPageWithLayout = () => {
  const {user, isLoadingFetchUser} = useAccount({});

  return (
    <>
      <Head>
        <title>Mon compte</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{width: {xs: '100%', md: '80%'}}}>
          {isLoadingFetchUser && (
            <Box display="flex" justifyContent="center" my={10}>
              <CircularProgress />
            </Box>
          )}
          {!isLoadingFetchUser && !user && (
            <Box
              width="100%"
              display="flex"
              flexDirection="column"
              alignItems="center">
              <Typography
                pt={4}
                pb={6}
                fontSize={{xs: 28, md: 30}}
                fontWeight={600}>
                Mot de passe oublié
              </Typography>
              <ForgotPasswordForm />
            </Box>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default ForgotPassword;
