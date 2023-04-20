import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardLayout />
      <Box component='main' sx={{ marginLeft: '20%', marginTop: '100px' }}>
        Hello tout le monde !
      </Box>
    </>
  );
};

export default Dashboard;
