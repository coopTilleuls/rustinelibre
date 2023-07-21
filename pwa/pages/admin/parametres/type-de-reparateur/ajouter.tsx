import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {Container, Paper} from '@mui/material';
import AdminLayout from '@components/admin/AdminLayout';
import RepairerTypeForm from '@components/admin/parameters/repairerType/RepairerTypeForm';

const AddBikeType: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Ajouter un type de vélo</title>
      </Head>
      <AdminLayout />
      <Box component="main" sx={{marginLeft: '20%', marginRight: '5%'}}>
        <Container sx={{width: {xs: '100%', md: '50%'}}}>
          <Paper elevation={4} sx={{maxWidth: 400, p: 4, mt: 4, mx: 'auto'}}>
            <Box
              sx={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}>
              <RepairerTypeForm repairerType={null} />
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AddBikeType;
