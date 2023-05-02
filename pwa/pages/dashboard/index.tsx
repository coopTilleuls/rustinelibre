import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardLayout>
        <Box component="main">Hello tout le monde !</Box>
      </DashboardLayout>
    </>
  );
};

export default Dashboard;
