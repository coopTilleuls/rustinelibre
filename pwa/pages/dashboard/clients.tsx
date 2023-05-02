import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';

const Customers = () => {
  return (
    <>
      <Head>
        <title>Clients</title>
      </Head>
      <DashboardLayout>
        <Box component="main">Ici mes clients</Box>
      </DashboardLayout>
    </>
  );
};

export default Customers;
