import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import {Container, Typography, Box} from '@mui/material';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import Preamble from '@components/privacy-policy/Preamble';
import PrinciplesGoverningTheTreatmentsPerformed from '@components/privacy-policy/PrinciplesGoverningTheTreatmentsPerformed';
import ProcessingOfYourData from '@components/privacy-policy/ProcessingOfYourData';
import YourRights from '@components/privacy-policy/YourRights';
import Notifications from '@components/privacy-policy/Notifications';
import Cookies from '@components/privacy-policy/Cookies';

const PrivacyPolicy: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>CGU</title>
      </Head>
      <WebsiteLayout>
        <Box
          bgcolor="lightprimary.light"
          height="100%"
          width="100%"
          position="absolute"
          top="0"
          left="0"
          zIndex="-1"
        />
        <Container>
          <Box display="flex" flexDirection="column" gap={8} py={4}>
            <Typography variant="h1" color="primary" textAlign="center">
              Politique de confidentialité
            </Typography>
            <Box display="flex" flexDirection="column" gap={6}>
              <Preamble />
              <PrinciplesGoverningTheTreatmentsPerformed />
              <ProcessingOfYourData />
              <YourRights />
              <Notifications />
              <Cookies />
            </Box>
          </Box>
        </Container>
      </WebsiteLayout>
    </>
  );
};

export default PrivacyPolicy;
