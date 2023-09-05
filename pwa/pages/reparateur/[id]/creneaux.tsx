import {NextPageWithLayout} from 'pages/_app';
import React, {useCallback, useEffect, useState} from 'react';
import Head from 'next/head';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {repairerResource} from '@resources/repairerResource';
import {appointmentResource} from '@resources/appointmentResource';
import {openingHoursResource} from '@resources/openingHours';
import {useAccount} from '@contexts/AuthContext';
import {Container, Box, Button, Typography} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import SlotsStep from '@components/rendez-vous/SlotsStep';
const PinMap = dynamic(() => import('@components/rendez-vous/PinMap'), {
  ssr: false,
  loading: () => <FullLoading />,
});
import {Repairer} from '@interfaces/Repairer';
import {isCyclist} from '@helpers/rolesHelpers';
import FullLoading from '@components/common/FullLoading';
import ConnectModal from '@components/rendez-vous/modals/ConnectModal';
import NotCyclistModal from '@components/rendez-vous/modals/NotCyclistModal';
import RepairerPresentationCard from '@components/repairers/RepairerPresentationCard';
import RecapStep from '@components/rendez-vous/RecapStep';
import OptionalStep from '@components/rendez-vous/OptionalStep';

const RepairerSlots: NextPageWithLayout = () => {
  const router = useRouter();
  const [tunnelStep, setTunnelStep] = useState<string>('slots');
  const [slotSelected, setSlotSelected] = useState<string | null>(null);
  const [openingHours, setOpeningHours] = useState<
    OpeningsObjectType | [] | null
  >();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingHours, setLoadingHours] = useState<boolean>(false);
  const [loadingAppointmentCreate, setLoadingAppointmentCreate] =
    useState<boolean>(false);
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const {id} = router.query;
  const {user, isLoadingFetchUser} = useAccount({
    redirectIfMailNotConfirm: router.asPath,
  });

  interface OpeningsObjectType {
    [key: string]: string[];
  }

  async function fetchRepairer() {
    if (id) {
      setLoading(true);
      const repairer = await repairerResource.getById(id.toString());
      setRepairer(repairer);
      setLoading(false);
    }
  }

  const fetchOpeningHours = useCallback(async () => {
    if (!repairer) return;
    setLoadingHours(true);
    const openingHoursFetch =
      await openingHoursResource.getRepairerSlotsAvailable(repairer.id);
    setOpeningHours(filterDates(openingHoursFetch));
    setLoadingHours(false);
  }, [repairer]);

  const filterDates = (
    data: Record<string, string[]>
  ): Record<string, string[]> => {
    // Get current date as a string
    const currentDate = new Date();
    const currentDateStr = currentDate.toISOString().split('T')[0];

    // If current date is in our data
    if (currentDateStr in data) {
      const [year, month, day] = currentDateStr.split('-');
      const currentHours = data[currentDateStr];
      const filteredHours = currentHours.filter((hour) => {
        const [hours, minutes] = hour.split(':');
        const date = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(hours),
          parseInt(minutes)
        );
        return date >= currentDate;
      });

      if (filteredHours.length === 0) {
        delete data[currentDateStr];
      } else {
        data[currentDateStr] = filteredHours;
      }
    }

    return data;
  };

  useEffect(() => {
    fetchRepairer();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (repairer) fetchOpeningHours();
  }, [repairer, fetchOpeningHours]);

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
    setLoadingAppointmentCreate(true);

    const newAppointment = await appointmentResource.post({
      repairer: repairer['@id'],
      slotTime: slotSelected,
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address: address,
    });

    if (newAppointment) {
      router.push(`/rendez-vous/${newAppointment.id}/auto-diagnostic`);
    } else setLoadingAppointmentCreate(false);
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
        {(loading || loadingHours) && <FullLoading />}
        <Box component="main" py={2}>
          <Box
            bgcolor="lightprimary.light"
            height="100%"
            width="100%"
            position="absolute"
            top="0"
            left="0"
            zIndex="-1"
            display={{xs: 'none', md: 'block'}}
          />
          <Container
            sx={{
              display: 'flex',
              flexDirection: {xs: 'column', md: 'row-reverse'},
              alignItems: 'flex-start',
              gap: 8,
              maxWidth: '1000px!important',
            }}>
            {tunnelStep === 'slots' && (
              <Box
                sx={{
                  position: 'sticky',
                  width: '300px',
                  top: '94px',
                  pt: 8,
                  display: {xs: 'none', md: 'flex'},
                }}>
                {repairer && (
                  <RepairerPresentationCard
                    repairer={repairer}
                    sx={{
                      width: '100%',
                    }}
                    noAction
                    withName
                  />
                )}
              </Box>
            )}
            <Box
              display="flex"
              flexDirection="column"
              width="100%"
              sx={
                tunnelStep !== 'slots'
                  ? {
                      bgcolor: 'white',
                      borderRadius: 6,
                      boxShadow: {xs: 0, md: 1},
                      mt: {xs: 0, md: 2},
                      p: {xs: 0, md: 4},
                      mx: 'auto',
                      textAlign: 'center',
                      alignItems: 'center',
                      maxWidth: '800px',
                    }
                  : {flex: 1, alignItems: 'flex-start'}
              }>
              {tunnelStep == 'slots' && (
                <Link
                  legacyBehavior
                  passHref
                  href={{
                    pathname: `/reparateur/${repairer?.id}-${repairer?.slug}`,
                    query: router.query,
                  }}>
                  <Button variant="outlined" color="secondary" size="small">
                    Retour
                  </Button>
                </Link>
              )}
              {tunnelStep == 'optionalPage' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{alignSelf: 'flex-start'}}
                  onClick={() => setTunnelStep('slots')}>
                  Consulter les créneaux
                </Button>
              )}
              {tunnelStep == 'pinMap' && (
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  sx={{alignSelf: 'flex-start'}}
                  onClick={() => setTunnelStep('slots')}>
                  Retour
                </Button>
              )}
              {tunnelStep == 'confirm' && (
                <Button
                  variant="outlined"
                  color="secondary"
                  size="small"
                  sx={{alignSelf: 'flex-start'}}
                  onClick={() =>
                    setTunnelStep(
                      repairer?.optionalPage && repairer.optionalPage !== ''
                        ? 'optionalPage'
                        : 'slots'
                    )
                  }>
                  Précédent
                </Button>
              )}
              <Typography
                component="h1"
                variant="h2"
                color="primary.main"
                sx={{my: 2}}>
                Demande de rendez-vous
              </Typography>
              {user &&
                repairer &&
                isCyclist(user) &&
                openingHours &&
                tunnelStep === 'slots' && (
                  <SlotsStep
                    handleSelectSlot={handleSelectSlot}
                    openingHours={openingHours}
                  />
                )}
              {user && repairer && tunnelStep == 'optionalPage' && (
                <OptionalStep
                  optionalPage={repairer.optionalPage}
                  confirmAppointmentRequest={confirmAppointmentRequest}
                />
              )}
              {user && repairer && tunnelStep == 'pinMap' && (
                <Box width="100%" position="relative" zIndex={1}>
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
                </Box>
              )}
              {user && tunnelStep == 'confirm' && repairer && (
                <RecapStep
                  repairer={repairer}
                  slotSelected={slotSelected!}
                  isLoading={loadingAppointmentCreate}
                  handleConfirmAppointment={handleConfirmAppointment}
                />
              )}
            </Box>
          </Container>
        </Box>
        {repairer && (
          <>
            <ConnectModal
              open={!user && !isLoadingFetchUser}
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
          </>
        )}
      </WebsiteLayout>
    </div>
  );
};

export default RepairerSlots;
