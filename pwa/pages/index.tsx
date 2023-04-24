import Head from 'next/head';
import { HomeCard } from '@components/home/HomeCard';
import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import WebsiteLayout from '@components/layout/WebsiteLayout';

const Home = () => {
  return (
    <>
      <Head>
        <title>Bienvenue sur la page d’accueil!</title>
      </Head>
      <WebsiteLayout />
      <Box sx={{ width: '100%' }}>
        <Stack spacing={2}>
          <HomeCard
            title="Besoin d'une réparation sur ton vélo ?"
            subTitle='Trouve un rendez vous chez un réparateur'
            button='Je recherche'
            pageLink='/reparateur/chercher-un-reparateur'
          />
          <HomeCard
            title="Mon carnet d'entretien"
            subTitle="Envie de bichonner votre monture ? Créez lui un carnet d'entretien"
            button='Je créé mon carnet'
            pageLink='/carnet/creer-mon-carnet'
          />
          <HomeCard
            title='Tu es réparateur ?'
            subTitle='Rejoins notre collectif de réparateurs sur la plateforme'
            button='Je rejoins le collectif'
            pageLink='/reparateur/rejoindre-le-collectif'
          />
        </Stack>
      </Box>
    </>
  );
};

export default Home;
