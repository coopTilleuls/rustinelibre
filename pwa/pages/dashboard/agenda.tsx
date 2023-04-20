import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import DashboardLayout from '@components/dashboard/DashboardLayout';

const Agenda = () => {
  return (
    <>
      <Head>
        <title>Agenda</title>
      </Head>
      <DashboardLayout />
      <Box component='main' sx={{ marginLeft: '20%', marginTop: '100px' }}>
        Ici mon agenda
      </Box>
    </>
  );
};

export default Agenda;
