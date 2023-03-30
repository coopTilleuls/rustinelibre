import Head from "next/head";
import {HomeCard} from '@components/home/HomeCard';
import React from "react";
import "@fontsource/poppins";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import dynamic from "next/dynamic";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
const Navbar = dynamic(() => import("components/layout/Navbar"));
const Footer = dynamic(() => import("components/layout/Footer"));

const Home = () => {

    return (
        <div className="w-full overflow-x-hidden">
            <Head>
                <title>Bienvenue sur la page d'accueil!</title>
            </Head>
            <Navbar />

            <Box sx={{ width: '100%' }}>
                <Stack spacing={2}>
                    <HomeCard
                        title="Besoin d'une réparation sur ton vélo ?"
                        subTitle="Trouve un rendez vous chez un réparateur"
                        button="Je recherche"
                        pageLink="/reparateur/chercher-un-reparateur"
                    />
                    <HomeCard
                        title="Mon carnet d'entretien"
                        subTitle="Envie de bichonner votre monture ? Créez lui un carnet d'entretien"
                        button="Je créé mon carnet"
                        backgroundColor="bg-slate-400"
                        pageLink="/carnet/creer-mon-carnet"
                    />
                    <HomeCard
                        title="Tu es réparateur ?"
                        subTitle="Rejoins notre collectif de réparateurs sur la plateforme"
                        button="Je rejoins le collectif"
                        backgroundColor="bg-slate-200"
                        pageLink="/reparateur/rejoindre-le-collectif"
                    />
                </Stack>
            </Box>
            <Footer />
        </div>
        )
};

export default Home;
