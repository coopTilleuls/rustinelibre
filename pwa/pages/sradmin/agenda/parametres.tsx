import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import {useAccount} from '@contexts/AuthContext';
import {Box, Tabs, Tab} from '@mui/material';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {Repairer} from '@interfaces/Repairer';
import {NextPageWithLayout} from '../../_app';
import OpeningHours from '@components/dashboard/agenda/OpeningHours';
import ExceptionalClosure from '@components/dashboard/agenda/ExceptionalClosure';

const AgendaParameters: NextPageWithLayout = () => {
  const [repairer, setRepairer] = useState<Repairer | null>(null);
  const [tabValue, setTabValue] = React.useState<number>(0);
  const {user} = useAccount({});

  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (user && user.repairer) {
      setRepairer(user.repairer);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Paramètres agenda | Rustine Libre</title>
      </Head>
      <DashboardLayout>
        <Box component="main" maxWidth="1200">
          <Tabs value={tabValue} onChange={handleChangeTab}>
            <Tab label="Jours et plages horaires" />
            <Tab label="Fermetures exceptionnelles" />
          </Tabs>

          <Box sx={{marginTop: 3}}>
            {repairer && tabValue === 0 && <OpeningHours repairer={repairer} />}
            {repairer && tabValue === 1 && (
              <ExceptionalClosure repairer={repairer} />
            )}
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

export default AgendaParameters;
