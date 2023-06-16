import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import {repairerResource} from '@resources/repairerResource';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Repairer} from '@interfaces/Repairer';
import Link from 'next/link';
import {
  Container,
  CircularProgress,
  Box,
  Typography,
  Paper,
  Stack,
  Button,
} from '@mui/material';
import useMediaQuery from '@hooks/useMediaQuery';
import {appointmentResource} from '@resources/appointmentResource';
import {useAccount} from '@contexts/AuthContext';
import SlotsStep from '@components/rendez-vous/SlotsStep';
import OptionalStep from '@components/rendez-vous/OptionalStep';
import RecapStep from '@components/rendez-vous/RecapStep';

const RepairerSlots: NextPageWithLayout = () => {
  const router = useRouter();
  const [tunnelStep, setTunnelStep] = useState<string>('slots');
  const [slotSelected, setSlotSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const {id} = router.query;
  const {user} = useAccount({});

  async function fetchRepairer() {
    if (id) {
      setLoading(true);
      const repairer = await repairerResource.getById(id.toString());
      setLoading(false);
      setRepairer(repairer);
    }
  }

  useEffect(() => {
    fetchRepairer();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps


  useEffect(() => {
    if (user && !user.emailConfirmed) {
        router.push(`/inscription?next=${encodeURIComponent(router.asPath)}`);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelectSlot = (day: string, time: string): void => {
    setSlotSelected(day + 'T' + time + ':00.000Z');
    if (repairer?.optionalPage && repairer.optionalPage !== '') {
      setTunnelStep('optionalPage');
    } else {
      setTunnelStep('confirm')
    }
  };

  const confirmAppointmentRequest = () => {
    setTunnelStep('confirm');
  };

  const handleConfirmAppointment = async () => {
    if (!repairer || !user || !slotSelected) {
      return;
    }

    const newAppointment = await appointmentResource.post({
      repairer: repairer['@id'],
      slotTime: slotSelected
    });

    if (newAppointment) {
      router.push(`/rendez-vous/${newAppointment.id}/auto-diagnostic`);
    }
  };

  const handleLogin = (): void => {
    router.push('/login?next=' + encodeURIComponent(router.asPath));
  };

  const handleRegistration = (): void => {
    router.push('/inscription?next=' + encodeURIComponent(router.asPath));
  };

  return (
    <div style={{width: '100vw', overflowX: 'hidden'}}>
      <Head>
        <title>Demande de rendez-vous {repairer?.name}</title>
      </Head>
      <WebsiteLayout>
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              mt: {md: 8},
              mb: 10,
            }}>
            {loading && <CircularProgress sx={{marginLeft: '30%'}} />}

            {!loading && repairer && (
              <Box>
                <Container maxWidth="md" sx={{padding: {xs: 0}}}>
                  <Paper elevation={isMobile ? 0 : 4} sx={{p: 3}}>
                    {tunnelStep == 'slots' && (
                      <Link href={`/reparateur/${repairer.id}`}>
                        <Button variant="outlined">Retour</Button>
                      </Link>
                    )}
                    {tunnelStep == 'optionalPage' && (
                      <Button
                        variant="outlined"
                        onClick={() => setTunnelStep('slots')}>
                        Consulter les créneaux
                      </Button>
                    )}
                    {tunnelStep == 'confirm' && (
                      <Button
                        variant="outlined"
                        onClick={() => setTunnelStep('optionalPage')}>
                        Précédent
                      </Button>
                    )}
                    <Stack
                      spacing={5}
                      marginBottom={4}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}>
                      {!user && (
                        <Stack
                          spacing={4}
                          display="flex"
                          flexDirection="column"
                          alignItems="center">
                          <Typography component="p" align="center" sx={{mt: 4}}>
                            Connectez-vous ou inscrivez-vous pour envoyer la
                            demande au réparateur.
                          </Typography>
                          <Button
                            onClick={handleLogin}
                            variant="contained"
                            sx={{width: 150}}>
                            Se connecter
                          </Button>
                          <Button
                            onClick={handleRegistration}
                            variant="outlined"
                            sx={{width: 150}}>
                            S&apos;inscrire
                          </Button>
                        </Stack>
                      )}
                      {user && repairer && tunnelStep == 'slots' && (
                        <SlotsStep
                          handleSelectSlot={handleSelectSlot}
                          repairer={repairer}
                        />
                      )}
                      {user && tunnelStep == 'optionalPage' && (
                        <OptionalStep
                          optionalPage={repairer.optionalPage}
                          confirmAppointmentRequest={confirmAppointmentRequest}
                        />
                      )}
                      {user && tunnelStep == 'confirm' && (
                        <RecapStep
                          repairer={repairer}
                          slotSelected={slotSelected!}
                          handleConfirmAppointment={handleConfirmAppointment}
                        />
                      )}
                    </Stack>
                  </Paper>
                </Container>
              </Box>
            )}
          </Box>
        </main>
      </WebsiteLayout>
    </div>
  );
};

export default RepairerSlots;
