import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import Box from '@mui/material/Box';
import {Container, Paper} from '@mui/material';
import AdminLayout from '@components/admin/AdminLayout';
import InterventionForm from '@components/admin/parameters/interventions/InterventionForm';

const AddIntervention: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Ajouter une intervention | Rustine Libre</title>
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
              <InterventionForm intervention={null} />
            </Box>
          </Paper>
        </Container>
      </Box>
    </>
  );
};

export default AddIntervention;
