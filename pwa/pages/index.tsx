import React from 'react';
import Head from 'next/head';
import {HomeCard} from '@components/home/HomeCard';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';

const Home = () => {
  return (
    <>
      <Head>
        <title>Bienvenue sur la page d’accueil!</title>
      </Head>
      <WebsiteLayout />
      <Container sx={{pt: 10}}>
        <Stack spacing={{xs: 2, md: 4}} sx={{mt: {xs: 2, md: 6}, mb: 12}}>
          <HomeCard
            title="Besoin d'une réparation sur ton vélo ?"
            subTitle="Trouve un rendez vous chez un réparateur"
            buttonName="Je recherche"
            pageLink="/reparateur/chercher-un-reparateur"
            backgroundColor="grey.100"
          />
          <HomeCard
            title="Mon carnet d'entretien"
            subTitle="Envie de bichonner votre monture ? Créez lui un carnet d'entretien"
            buttonName="Je créé mon carnet"
            pageLink="/velos/mes-velos"
            backgroundColor="grey.200"
          />
          <HomeCard
            title="Tu es réparateur ?"
            subTitle="Rejoins notre collectif de réparateurs sur la plateforme"
            buttonName="Je rejoins le collectif"
            pageLink="/reparateur/inscription"
            backgroundColor="grey.300"
          />
        </Stack>
      </Container>
    </>
  );
};

export default Home;
