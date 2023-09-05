import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useAccount} from '@contexts/AuthContext';
import {Box, Button, Container, Typography} from '@mui/material';
import SearchARepairer from '@components/homepage/SearchARepairer';
import CreateMaintenanceBooklet from '@components/homepage/CreateMaintenanceBooklet';
import JoinTheCollective from '@components/homepage/JoinTheCollective';
import FavoriteRepairers from '@components/homepage/FavoriteRepairers';
import {isBoss, isEmployee} from '@helpers/rolesHelpers';
import Grid from '@mui/material/Unstable_Grid2';
import Arg1 from '@public/img/arg1.png';
import Arg2 from '@public/img/arg2.png';
import Arg3 from '@public/img/arg3.png';
import Image from 'next/image';
import Link from 'next/link';
import Faq from '@components/homepage/Faq';

const Home = () => {
  const {user} = useAccount({redirectIfMailNotConfirm: '/'});

  const args = [
    {
      title: 'Pédalez 100% local',
      text: 'Prenez rendez-vous sur la métropole lilloise ou ailleurs',
      img: <Image src={Arg1} width={100} height={100} alt="" />,
    },
    {
      title: 'Vos supers réparateurs',
      text: "Un collectif d'experts pour un travail sur-mesure et de qualité",
      img: <Image src={Arg2} width={100} height={100} alt="" />,
    },
    {
      title: 'Solidaire toi-même !',
      text: "Réparer son vélo, c'est bon pour la planête et pour l'économie locale !",
      img: <Image src={Arg3} width={100} height={100} alt="" />,
    },
  ];

  return (
    <>
      <Head>
        <title>La rustine libre</title>
      </Head>
      <WebsiteLayout>
        <SearchARepairer />
        <Container>
          <Box
            gap={{xs: 6, md: 8}}
            width="100%"
            display="flex"
            flexDirection="column">
            <Grid container spacing={4} width="100%" sx={{mx: 'auto'}}>
              {args.map((arg) => (
                <Grid xs={12} md={4} key={arg.title}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: {xs: 'column', lg: 'row'},
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: {xs: 'center', lg: 'left'},
                      gap: 2,
                    }}>
                    <Box width="100px" height="100px">
                      {arg.img}
                    </Box>
                    <Box>
                      <Typography gutterBottom variant="h5">
                        {arg.title}
                      </Typography>
                      <Typography>{arg.text}</Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
            <Link
              href="/reparateur/chercher-un-reparateur"
              legacyBehavior
              passHref>
              <Button
                size="large"
                variant="contained"
                sx={{mx: 'auto'}}
                color="secondary">
                Je prends rendez-vous
              </Button>
            </Link>
            {user && !isBoss(user) && !isEmployee(user) && (
              <FavoriteRepairers user={user} />
            )}
            <CreateMaintenanceBooklet />
          </Box>
        </Container>
        <Box my={6}>
          <Faq />
        </Box>
        <Container>
          <JoinTheCollective />
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default Home;
