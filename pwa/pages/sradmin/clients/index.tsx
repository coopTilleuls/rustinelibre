import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';
import CustomersList from '@components/dashboard/customers/CustomersList';
import {Typography} from '@mui/material';

const Customers = () => {
  return (
    <>
      <Head>
        <title>Clients | Rustine Libre</title>
      </Head>
      <DashboardLayout>
        <Box component="main">
          <Box
            sx={{
              my: 2,
            }}>
            <Typography variant="h5">Liste des clients</Typography>
          </Box>
          <CustomersList />
        </Box>
      </DashboardLayout>
    </>
  );
};

export default Customers;
