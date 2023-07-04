import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useAccount} from '@contexts/AuthContext';
import {Box, Container, Stack} from '@mui/material';
import SearchARepairer from '@components/homepage/SearchARepairer';
import CreateMaintenanceBooklet from '@components/homepage/CreateMaintenanceBooklet';
import JoinTheCollective from '@components/homepage/JoinTheCollective';
import FavoriteRepairers from '@components/homepage/FavoriteRepairers';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';

const Home = () => {
  const {user} = useAccount({redirectIfMailNotConfirm: '/'});

  return (
    <>
      <Head>
        <title>La rustine libre</title>
      </Head>
      <WebsiteLayout>
        <Box
          gap={{xs: 6, md: 14}}
          width="100%"
          display="flex"
          flexDirection="column"
          alignItems="center"
          pb={{xs: 6, md: 8}}>
          <Box
            bgcolor="lightprimary.main"
            width="100%"
            paddingY={6}
            minHeight={{
              xs: 'calc(100vh - 112px)',
              sm: 'calc(100vh - 120px)',
              md: 'calc(100vh - 152px)',
            }}>
            <Container>
              <SearchARepairer />
            </Container>
          </Box>
        </Box>
        <Container sx={{px: {xs: 0}}}>
          <Box
            gap={{xs: 6, md: 8}}
            width="100%"
            display="flex"
            flexDirection="column">
            {user && !isBoss(user) && !isEmployee(user) && (
              <FavoriteRepairers user={user} />
            )}
            <CreateMaintenanceBooklet />
            <JoinTheCollective />
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Home;
