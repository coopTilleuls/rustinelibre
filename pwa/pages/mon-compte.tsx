import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Typography, Box, Container} from '@mui/material';
import {useAccount} from '@contexts/AuthContext';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import MyInformations from '@components/profile/MyInformations';
import RemoveAccount from '@components/profile/RemoveAccount';
import ChangePassword from '@components/profile/ChangePassword';

const MyProfile: NextPageWithLayout = () => {
  const {user} = useAccount({redirectIfNotFound: '/login'});

  return (
    <>
      <Head>
        <title>Mon compte</title>
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
          <Typography
            textAlign="center"
            variant="h1"
            sx={{mt: 4}}
            color="primary">
            Mon compte
          </Typography>
          {user && (
            <Box
              py={4}
              display="flex"
              flexDirection="column"
              gap={4}
              position="relative"
              alignItems="flex-start">
              <MyInformations userLogged={user} />
              <ChangePassword />
              <RemoveAccount />
            </Box>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default MyProfile;
