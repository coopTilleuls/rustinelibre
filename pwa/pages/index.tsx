import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import SearchARepairer from '@components/homepage/SearchARepairer';
import CreateMaintenanceBooklet from '@components/homepage/CreateMaintenanceBooklet';
import JoinTheCollective from '@components/homepage/JoinTheCollective';

const Home = () => {
  return (
    <>
      <Head>
        <title>Bienvenue sur la page d’accueil!</title>
      </Head>
      <WebsiteLayout />
      <Container sx={{px: {xs: 0}, pt: 10}}>
        <Stack spacing={{xs: 6, md: 14}} sx={{mt: {xs: 2, md: 6}, mb: 12}}>
          <SearchARepairer />
          <CreateMaintenanceBooklet />
          <JoinTheCollective />
        </Stack>
      </Container>
    </>
  );
};

export default Home;
