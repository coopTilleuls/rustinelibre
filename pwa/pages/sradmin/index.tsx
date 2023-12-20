import React, {useEffect, useState} from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import {useAccount} from '@contexts/AuthContext';
import DashboardHomeContent from '@components/dashboard/home/DashboardHomeContent';
import {Repairer} from '@interfaces/Repairer';

const Dashboard = () => {
  const {user} = useAccount({});
  const [repairer, setRepairer] = useState<Repairer | null>(null);

  useEffect(() => {
    if (user && user.repairer) {
      setRepairer(user.repairer);
      return;
    }
    if (user && user.repairerEmployee) {
      setRepairer(user.repairerEmployee.repairer);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Head>
        <title>Tableau de bord | Rustine Libre</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          {user && repairer && (
            <DashboardHomeContent repairer={repairer} currentUser={user} />
          )}
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
