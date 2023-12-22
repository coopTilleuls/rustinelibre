import {NextPageWithLayout} from 'pages/_app';
import React, {useMemo, useState} from 'react';
import Head from 'next/head';
import {Container, Typography, Paper, Button, Box} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {useAccount} from '@contexts/AuthContext';
import {useRouter} from 'next/router';
import FullLoading from '@components/common/FullLoading';
import MyOldAppointments from '@components/rendez-vous/MyOldAppointments';
import MyFutureAppointment from '@components/rendez-vous/MyFutureAppointments';

const MyAppointments: NextPageWithLayout = () => {
  const {user, isLoadingFetchUser} = useAccount({});
  const [isOldLoading, setIsOldLoaading] = useState<boolean>(false);
  const [isFutureLoading, setIsFutureLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleLogin = () => {
    router.push(`/login?next=${encodeURIComponent(router.asPath)}`);
  };

  const isLoading = useMemo(() => {
    return (!user && isLoadingFetchUser) || isOldLoading || isFutureLoading;
  }, [user, isLoadingFetchUser, isOldLoading, isFutureLoading]);

  return (
    <>
      <Head>
        <title>Mes rendez-vous | Rustine Libre</title>
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
        <Container
          sx={{
            py: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            minHeight: {
              xs: 'calc(100vh - 112px)',
              sm: 'calc(100vh - 120px)',
              md: 'calc(100vh - 152px)',
            },
          }}>
          <Typography variant="h1" textAlign="center" mb={5} color="primary">
            Vos rendez-vous
          </Typography>
          {!user && !isLoadingFetchUser && (
            <Paper
              elevation={4}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                my: 4,
                mx: 'auto',
                p: 4,
                width: '60%',
                ml: '20%',
              }}>
              <Typography>
                Connectez-vous pour accéder à la liste de vos rendez-vous
              </Typography>
              <Button variant="contained" onClick={handleLogin} sx={{mt: 4}}>
                Me connecter
              </Button>
            </Paper>
          )}
          {isLoading && <FullLoading />}

          {user && (
            <Box display="flex" flexDirection="column" gap={6} width="100%">
              <MyFutureAppointment
                currentUser={user}
                setLoading={setIsFutureLoading}
              />
              <MyOldAppointments
                currentUser={user}
                setLoading={setIsOldLoaading}
              />
            </Box>
          )}
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default MyAppointments;
