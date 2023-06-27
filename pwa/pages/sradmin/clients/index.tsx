import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import CustomersList from '@components/dashboard/customers/CustomersList';

const Customers = () => {
  return (
    <>
      <Head>
        <title>Clients</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <CustomersList />
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Customers;
