import Head from 'next/head';
import React from 'react';
import Box from '@mui/material/Box';
import AdminLayout from '@components/admin/AdminLayout';
import UsersList from '@components/admin/users/UsersList';

const Users = () => {
  return (
    <>
      <Head>
        <title>Utilisateurs</title>
      </Head>
      <AdminLayout>
        <Box component="main">
          <UsersList />
        </Box>
      </AdminLayout>
    </>
  );
};

export default Users;
