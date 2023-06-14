import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Container, Stack} from '@mui/material';
import SearchARepairer from '@components/homepage/SearchARepairer';
import CreateMaintenanceBooklet from '@components/homepage/CreateMaintenanceBooklet';
import JoinTheCollective from '@components/homepage/JoinTheCollective';
import FavoriteRepairers from '@components/homepage/FavoriteRepairers';
import {useAccount} from '@contexts/AuthContext';

const Home = () => {
  const {user} = useAccount({});

  return (
    <>
      <Head>
        <title>Bienvenue sur la page d’accueil!</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{px: {xs: 0}}}>
          <Stack spacing={{xs: 6, md: 14}} sx={{mt: {xs: 2, md: 6}, mb: 12}}>
            <SearchARepairer />
            {user && <FavoriteRepairers />}
            <CreateMaintenanceBooklet />
            <JoinTheCollective />
          </Stack>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Home;
