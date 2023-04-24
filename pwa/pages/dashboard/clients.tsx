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
      <DashboardLayout />
      <Box component='main' sx={{ marginLeft: '20%', marginTop: '100px' }}>
        Ici mes clients
      </Box>
    </>
  );
};

export default Customers;
