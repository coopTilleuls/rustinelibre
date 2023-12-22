import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import Link from 'next/link';
import {appointmentResource} from '@resources/appointmentResource';
import {Box, Button, Typography, Container, Stack} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Appointment} from '@interfaces/Appointment';
import FullLoading from '@components/common/FullLoading';
import {AppointmentCard} from '@components/rendez-vous/AppointmentCard';

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

  return (
    <>
      <Head>
        <title>Récapitulatif | Rustine Libre</title>
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
        <main>
          <Container sx={{py: 8}}>
            {loading && <FullLoading />}
            {!loading && appointment && (
              <Stack
                spacing={4}
                display="flex"
                flexDirection="column"
                alignItems="center">
                <Typography component="h1" variant="h1" color="primary">
                  Votre demande de rendez-vous
                </Typography>
                <Typography variant="body1">
                  Votre demande a bien été envoyée. Le réparateur vous
                  recontactera sous 72 heures maximum.
                </Typography>
                <Box my={4} width="100%" maxWidth="400px">
                  <AppointmentCard appointment={appointment} noActions />
                </Box>
                <Link href="/" legacyBehavior passHref>
                  <Button variant="outlined" color="secondary">
                    Retour à l&apos;accueil
                  </Button>
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
