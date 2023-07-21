import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {useAccount} from '@contexts/AuthContext';
import AdminLayout from '@components/admin/AdminLayout';

const Dashboard = () => {
  const {user} = useAccount({});

  return (
    <>
      <Head>
        <title>Admin</title>
      </Head>
      <AdminLayout>
        <Box component="main"></Box>
      </AdminLayout>
    </>
  );
};

export default Dashboard;
