import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';

const DashboardMessages = () => {
  return (
    <>
      <Head>
        <title>Messagerie</title>
      </Head>
      <DashboardLayout />
      <Box component='main' sx={{ marginLeft: '20%', marginTop: '100px' }}>
        Ici mes messages
      </Box>
    </>
  );
};

export default DashboardMessages;
