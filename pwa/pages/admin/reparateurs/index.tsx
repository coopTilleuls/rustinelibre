import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import AdminLayout from '@components/admin/AdminLayout';
import RepairersList from '@components/admin/repairers/RepairersList';

const Repairers = () => {
  return (
    <>
      <Head>
        <title>Solution de réparation</title>
      </Head>
      <AdminLayout>
        <Box component="main">
          <RepairersList />
        </Box>
      </AdminLayout>
    </>
  );
};

export default Repairers;
