import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {repairerResource} from '@resources/repairerResource';
import {useAccount} from '@contexts/AuthContext';
import {Container, Box, Tabs, Tab, CircularProgress} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {Repairer} from '@interfaces/Repairer';
import {NextPageWithLayout} from '../../_app';
import OpeningHours from '@components/dashboard/agenda/OpeningHours';
import ExceptionalClosure from '@components/dashboard/agenda/ExceptionalClosure';

const AgendaParameters: NextPageWithLayout = () => {
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const {user} = useAccount({});

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchRepairer = async () => {
      if (user && user.repairer) {
        setLoading(true);
        const repairerFetch: Repairer = await repairerResource.get(
          user.repairer
        );
        setRepairer(repairerFetch);
        setLoading(false);
      }
    };
    if (user) {
      fetchRepairer();
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Paramètres agenda</title>
      </Head>
      <DashboardLayout>
        <Container sx={{ml: 0}}>
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Jours et plages horaires" />
            <Tab label="Fermetures exceptionnelles" />
          </Tabs>

          <Box sx={{marginTop: 3}}>
            {loading && <CircularProgress />}
            {!loading && repairer && tabValue === 0 && (
              <OpeningHours repairer={repairer} />
            )}
            {!loading && repairer && tabValue === 1 && (
              <ExceptionalClosure repairer={repairer} />
            )}
          </Box>
        </Container>
      </DashboardLayout>
    </>
  );
};

export default AgendaParameters;
