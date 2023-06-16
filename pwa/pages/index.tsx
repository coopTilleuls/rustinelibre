import React, {useEffect} from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useAccount} from '@contexts/AuthContext';
import {Container, Stack} from '@mui/material';
import SearchARepairer from '@components/homepage/SearchARepairer';
import CreateMaintenanceBooklet from '@components/homepage/CreateMaintenanceBooklet';
import JoinTheCollective from '@components/homepage/JoinTheCollective';
import FavoriteRepairers from '@components/homepage/FavoriteRepairers';
import {isBoss, isEmployee} from "@helpers/rolesHelpers";
import {useRouter} from "next/router";

const Home = () => {
    const router = useRouter();
    const {user} = useAccount({});

    useEffect(() => {
        if (user && !user.emailConfirmed) {
            router.push(`/inscription?next=${encodeURIComponent(router.asPath)}`);
        }
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
    <>
      <Head>
        <title>Bienvenue sur la page d’accueil!</title>
      </Head>
      <WebsiteLayout>
        <Container sx={{px: {xs: 0}}}>
          <Stack spacing={{xs: 6, md: 14}} sx={{mt: {xs: 2, md: 6}, mb: 12}}>
            <SearchARepairer />
            {user && !isBoss(user) && !isEmployee(user) && <FavoriteRepairers user={user} />}
            <CreateMaintenanceBooklet />
            <JoinTheCollective />
          </Stack>
        </Container>
      </WebsiteLayout>
    </>
    );
};

export default Home;
