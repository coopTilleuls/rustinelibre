import React, {useContext, useEffect, useState} from 'react';
import dynamic from 'next/dynamic';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import {RepairerFormContext} from '@contexts/RepairerFormContext';
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
import DashboardInfosPhotos from '@components/dashboard/informations/Photos';
const MapPosition = dynamic(
  () => import('@components/dashboard/informations/MapPosition'),
  {
    ssr: false,
  }
);
import {RequestBody} from '@interfaces/Resource';
import {RepairerType} from '@interfaces/RepairerType';
import {Repairer} from '@interfaces/Repairer';
import {BikeType} from '@interfaces/BikeType';

type InformationsContainerProps = {
  bikeTypes: BikeType[];
  repairerTypes: RepairerType[];
  repairerFetch: Repairer;
};

const InformationsContainer = ({
  bikeTypes,
  repairerTypes,
  repairerFetch,
}: InformationsContainerProps) => {
  const [repairer, setRepairer] = useState<Repairer>(repairerFetch);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const {user} = useAccount({redirectIfMailNotConfirm: '/login'});

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const {
    setPendingRegistration,
    setErrorMessage,
    setSuccess,
  } = useContext(RepairerFormContext);

  useEffect(() => {
    if (repairer) {
      setLoading(false);
    }
  }, [repairer, setLoading]);

  const updateRepairer = async (iri: string, bodyRequest: RequestBody) => {
    if (!repairer) return;
    setErrorMessage(null);
    setPendingRegistration(true);
    try {
      await repairerResource.put(iri, bodyRequest);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      const repairerFetch: Repairer = await repairerResource.get(
        iri
      );
      setRepairer(repairerFetch);
    } catch (e) {
      setErrorMessage('Mise à jour impossible');
    }
    setPendingRegistration(false);
  };

  const fetchRepairer = async () => {
    if (user && user.repairer) {
      const repairerFetch: Repairer = await repairerResource.get(
          user.repairer['@id']
      );
      setRepairer(repairerFetch);
    }
  };

  return (
    <Container component="main" sx={{ml: 0}}>
      <Tabs value={tabValue} onChange={handleChangeTab}>
        <Tab label="Coordonnées"/>
        <Tab label="Description"/>
        <Tab label="Photos"/>
        <Tab label="Horaires"/>
        <Tab label="Informations complémentaires"/>
        <Tab label={`Position sur la carte`}/>
      </Tabs>

      <Box sx={{ marginTop: 3 }}>
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
                      bikeTypes={bikeTypes}
                      repairerTypes={repairerTypes}
                      updateRepairer={updateRepairer}
                  />
              )}
              {tabValue === 2 && (
                  <DashboardInfosPhotos
                      repairer={repairer}
                      fetchRepairer={fetchRepairer}
                  />
              )}
              {tabValue === 3 && <OpeningHours repairer={repairer} updateRepairer={updateRepairer} />}
              {tabValue === 4 && <OptionalInfos repairer={repairer} updateRepairer={updateRepairer} />}
              {tabValue === 5 && repairer && (
                  <MapPosition repairer={repairer} updateRepairer={updateRepairer} />
              )}
            </>
        )}
      </Box>
    </Container>
  );
};

export default InformationsContainer;
