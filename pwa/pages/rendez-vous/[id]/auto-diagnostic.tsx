import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Box, Container, Typography} from '@mui/material';
const AutoDiagnosticTunnel = dynamic(
  () => import('@components/autoDiagnostic/AutodiagnosticTunnel'),
  {
    ssr: false,
    loading: () => <FullLoading />,
  }
);
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {AutodiagProvider} from '@contexts/AutodiagContext';
import FullLoading from '@components/common/FullLoading';

const AutoDiagnostic: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;

  return (
    <AutodiagProvider>
      <div style={{width: '100vw', overflowX: 'hidden'}}>
        <Head>
          <title>Auto diagnostic | Rustine Libre</title>
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
            display={{xs: 'none', md: 'block'}}
          />
          <main>
            <Box
              sx={{
                my: 4,
              }}>
              <Container>
                <Typography
                  variant="h1"
                  textAlign="center"
                  sx={{marginBottom: 4, marginTop: {xs: 4, md: 0}}}
                  color="primary">
                  Mon rendez-vous
                </Typography>
                {typeof id === 'string' && (
                  <AutoDiagnosticTunnel appointmentId={id} />
                )}
              </Container>
            </Box>
          </main>
        </WebsiteLayout>
      </div>
    </AutodiagProvider>
  );
};

export default AutoDiagnostic;
