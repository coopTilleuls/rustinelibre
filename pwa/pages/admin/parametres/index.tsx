import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import AdminLayout from '@components/admin/AdminLayout';
import ParametersContent from '@components/admin/parameters/ParametersContent';

const AdminParameters = () => {
  return (
    <>
      <Head>
        <title>Paramètres</title>
      </Head>
      <AdminLayout>
        <Box component="main">
          <ParametersContent />
        </Box>
      </AdminLayout>
    </>
  );
};

export default AdminParameters;
