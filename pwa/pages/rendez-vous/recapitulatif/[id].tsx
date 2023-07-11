import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {appointmentResource} from '@resources/appointmentResource';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Container,
  Stack,
} from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Appointment} from '@interfaces/Appointment';

const AppointmentSummary: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;
  const [loading, setLoading] = useState<boolean>(false);
  const [appointment, setAppointment] = useState<Appointment | null>(null);

  async function fetchAppointment() {
    if (id) {
      setLoading(true);
      const appointmentFetched = await appointmentResource.getById(
        id.toString()
      );
      setLoading(false);
      setAppointment(appointmentFetched);

      if (!appointmentFetched) {
        return router.push('/');
      }
    }
  }

  useEffect(() => {
    fetchAppointment();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const slotDate = new Date(appointment?.slotTime!).toLocaleString('fr-FR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const slotTime = appointment?.slotTime
    .split('T')[1]
    .substring(0, 5)
    .replace(':', 'h');

  return (
    <>
      <Head>
        <title>Récapitulatif</title>
      </Head>
      <WebsiteLayout>
        <main>
          <Container
            sx={{
              bgcolor: 'background.paper',
              mt: {md: 8},
              mb: 10,
            }}>
            {loading && <CircularProgress />}
            {!loading && appointment && (
              <Stack
                spacing={4}
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Typography
                  component="h2"
                  fontSize={18}
                  fontWeight={600}
                  my={{xs: 2}}>
                  Votre demande de rendez-vous
                </Typography>
                <Typography component="h4" my={{xs: 2}}>
                  Votre demande a bien été envoyée. Le réparateur vous
                  recontactera sous 72 heures maximum.
                </Typography>
                <Box p={3} sx={{border: '3px solid grey', borderRadius: 1}}>
                  <Box display="flex" justifyContent="center">
                    <EventAvailableIcon
                      sx={{fontSize: '8em'}}
                      color="primary"
                    />
                    <Stack
                      display="flex"
                      flexDirection="column"
                      alignItems="start"
                      p={1}>
                      <Typography
                        align="center"
                        textTransform="capitalize"
                        fontSize={18}
                        fontWeight={600}>
                        {slotDate}
                      </Typography>
                      <Typography align="center">{slotTime}</Typography>
                      <Box display="flex" alignItems="center">
                        <Typography align="center">Chez</Typography>
                        <Typography
                          color="primary"
                          fontWeight={600}
                          sx={{ml: 1}}>
                          {appointment.repairer.name}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                  {appointment.autoDiagnostic && (
                    <Box pl={2}>
                      <Typography align="left">
                        Type de vélo : Type de vélo
                      </Typography>
                      <Typography align="left">
                        Prestation : {appointment.autoDiagnostic.prestation}
                      </Typography>
                    </Box>
                  )}
                </Box>
                <Link href="/">
                  <Button variant="contained">Retour à l&apos;accueil</Button>
                </Link>
              </Stack>
            )}
          </Container>
        </main>
      </WebsiteLayout>
    </>
  );
};

export default AppointmentSummary;
