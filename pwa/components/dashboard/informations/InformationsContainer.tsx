import React, {useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import {
  Box,
  Tabs,
  Tab,
  Typography,
  CircularProgress,
  Container,
} from '@mui/material';
import ContactDetails from '@components/dashboard/informations/ContactDetails';
import Description from '@components/dashboard/informations/Description';
import OptionalInfos from '@components/dashboard/informations/OptionalInfos';
import OpeningHours from '@components/dashboard/informations/OpeningHours';
import Photos from '@components/dashboard/informations/Photos';
const MapPosition = dynamic(
  () => import('@components/dashboard/informations/MapPosition'),
  {
    ssr: false,
  }
);
import {RequestBody} from '@interfaces/Resource';
import {Repairer} from '@interfaces/Repairer';

interface InformationsContainerProps {
  editRepairer?: Repairer;
}

const InformationsContainer = ({editRepairer}: InformationsContainerProps) => {
  const {user} = useAccount({redirectIfMailNotConfirm: '/login'});

  const [repairer, setRepairer] = useState<Repairer>(
    user?.repairer! || editRepairer
  );
  const [tabValue, setTabValue] = React.useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (repairer) {
      setLoading(false);
    }
  }, [repairer, setLoading]);

  const updateRepairer = async (iri: string, bodyRequest: RequestBody) => {
    if (!repairer) return;
    await repairerResource.put(iri, bodyRequest);
    const response = await repairerResource.get(iri);
    setRepairer(response);
  };

  const fetchRepairer = async () => {
    if (user && user.repairer) {
      const response: Repairer = await repairerResource.get(
        user.repairer['@id']
      );
      setRepairer(response);
    }
  };

  return (
    <Container component="main" sx={{ml: 0}}>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Coordonnées" />
        <Tab label="Description" />
        <Tab label="Photos" />
        <Tab label="Horaires" />
        <Tab label="Informations complémentaires" />
        <Tab label="Position sur la carte" />
      </Tabs>
      <Box mt={3}>
        {loading ? (
          <CircularProgress />
        ) : !repairer ? (
          <Typography>Vous ne gérez pas de solution de réparation</Typography>
        ) : (
          <>
            {tabValue === 0 && (
              <ContactDetails
                repairer={repairer}
                updateRepairer={updateRepairer}
              />
            )}
            {tabValue === 1 && (
              <Description
                repairer={repairer}
                updateRepairer={updateRepairer}
              />
            )}
            {tabValue === 2 && (
              <Photos repairer={repairer} fetchRepairer={fetchRepairer} />
            )}
            {tabValue === 3 && (
              <OpeningHours
                repairer={repairer}
                updateRepairer={updateRepairer}
              />
            )}
            {tabValue === 4 && (
              <OptionalInfos
                repairer={repairer}
                updateRepairer={updateRepairer}
              />
            )}
            {tabValue === 5 && repairer && (
              <MapPosition
                repairer={repairer}
                updateRepairer={updateRepairer}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default InformationsContainer;
