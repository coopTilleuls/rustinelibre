import {NextPageWithLayout} from 'pages/_app';
import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {repairerResource} from '@resources/repairerResource';
import useMediaQuery from '@mui/material/useMediaQuery';
import {appointmentResource} from '@resources/appointmentResource';
import {useAccount} from '@contexts/AuthContext';
import {
  Container,
  Box,
  Paper,
  Stack,
  Button,
  Typography,
  Dialog,
} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import SlotsStep from '@components/rendez-vous/SlotsStep';
import RecapStep from '@components/rendez-vous/RecapStep';
const PinMap = dynamic(() => import('@components/rendez-vous/PinMap'), {
  ssr: false,
});
import {Repairer} from '@interfaces/Repairer';
import {isCyclist} from '@helpers/rolesHelpers';
import FullLoading from '@components/common/FullLoading';
import ConfirmAppointmentModal from '@components/rendez-vous/modals/ConfirmAppointmentModal';
import RecapAppointmentModal from '@components/rendez-vous/modals/RecapAppointmentModal';
import ConnectModal from '@components/rendez-vous/modals/ConnectModal';
import NotCyclistModal from '@components/rendez-vous/modals/NotCyclistModal';
import PinMapModal from '@components/rendez-vous/modals/PinMapModal';
import RepairerPresentationCard from '@components/repairers/RepairerPresentationCard';

const RepairerSlots: NextPageWithLayout = () => {
  const router = useRouter();
  const [tunnelStep, setTunnelStep] = useState<string>('slots');
  const [slotSelected, setSlotSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const isMobile = useMediaQuery('(max-width: 1024px)');
  const {id} = router.query;
  const {user} = useAccount({redirectIfMailNotConfirm: router.asPath});

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
  

  const handleSelectSlot = (day: string, time: string): void => {
    setSlotSelected(day + 'T' + time + ':00.000Z');
    if (repairer?.repairerType.name === 'Réparateur itinérant') {
      setTunnelStep('pinMap');
    } else if (repairer?.optionalPage && repairer.optionalPage !== '') {
      setTunnelStep('optionalPage');
    } else {
      setTunnelStep('confirm');
    }
  };

  const cancelPinMap = () => {
    setTunnelStep('slots');
  };

  const confirmPinMap = () => {
    if (repairer?.optionalPage && repairer.optionalPage !== '') {
      setTunnelStep('optionalPage');
    } else {
      setTunnelStep('confirm');
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
      slotTime: slotSelected,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address: address,
    });

    if (newAppointment) {
      router.push(`/rendez-vous/${newAppointment.id}/auto-diagnostic`);
    }
  };
  useEffect(() => {
    document.getElementById('websitelayout')!.scrollTop = 0;
  }, [tunnelStep]);

  return (
    <div style={{width: '100vw', overflowX: 'hidden'}}>
      <Head>
        <title>Demande de rendez-vous {repairer?.name}</title>
      </Head>
      <WebsiteLayout>
        {loading && <FullLoading />}
        {!loading && repairer && (
          <Box pt={4} pb={8} sx={{overflowX: 'clip'}}>
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
                display: 'flex',
                flexDirection: {xs: 'column', md: 'row-reverse'},
                alignItems: 'flex-start',
                gap: 8,
                maxWidth: '1000px!important',
              }}>
              <RepairerPresentationCard
                repairer={repairer}
                sx={{
                  position: 'sticky',
                  width: '300px',
                  top: '112px',
                  display: {xs: 'none', md: 'flex'},
                }}
                noAction
                withName
              />
              <Stack spacing={4} flex={1} pt={2} width="100%">
                <Link href={`/reparateur/${repairer?.id}-${repairer?.slug}`}>
                  <Button variant="outlined" color="secondary" size="small">
                    Retour
                  </Button>
                </Link>
                <Typography component="h1" variant="h1" color="primary.main">
                  Demande de rendez-vous
                </Typography>
                {user && repairer && isCyclist(user) && (
                  <SlotsStep
                    handleSelectSlot={handleSelectSlot}
                    repairer={repairer}
                  />
                )}
              </Stack>
            </Container>
          </Box>
        )}
        {repairer && (
          <ConfirmAppointmentModal
            open={!!(user && tunnelStep == 'optionalPage')}
            onClose={() => setTunnelStep('slots')}
            confirmAppointmentRequest={confirmAppointmentRequest}
            optionalPage={repairer.optionalPage}
          />
        )}
        {repairer && (
          <>
            <RecapAppointmentModal
              open={!!(user && tunnelStep == 'confirm')}
              onClose={() => setTunnelStep('slots')}
              confirmAppointment={handleConfirmAppointment}
              repairer={repairer}
              slotSelected={slotSelected!}
            />
            <ConnectModal
              open={!user}
              onClose={() =>
                router.push(`/reparateur/${repairer.id}-${repairer.slug}`)
              }
            />
            <NotCyclistModal
              open={!!(user && !isCyclist(user))}
              onClose={() =>
                router.push(`/reparateur/${repairer.id}-${repairer.slug}`)
              }
            />
            <PinMapModal
              open={!!(user && repairer && tunnelStep == 'pinMap')}
              onClose={() => setTunnelStep('slots')}
              onConfirm={confirmPinMap}>
              <PinMap
                cancelPinMap={cancelPinMap}
                confirmPinMap={confirmPinMap}
                repairer={repairer}
                latitude={latitude}
                longitude={longitude}
                setLatitude={setLatitude}
                setLongitude={setLongitude}
                address={address}
                setAddress={setAddress}
              />
            </PinMapModal>
          </>
        )}
      </WebsiteLayout>
    </div>
  );
};

export default RepairerSlots;
