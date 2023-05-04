import {NextPageWithLayout} from 'pages/_app';
import React from 'react';
import Head from 'next/head';
import WebsiteLayout from '@components/layout/WebsiteLayout';
import {Box} from '@mui/material';
const AutoDiagnosticTunnel = dynamic(
  () => import('@components/autoDiagnostic/AutodiagnosticTunnel'),
  {
    ssr: false,
  }
);
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import {AutodiagProvider} from '@contexts/AutodiagContext';

const AutoDiagnostic: NextPageWithLayout = () => {
  const router = useRouter();
  const {id} = router.query;

  return (
    <AutodiagProvider>
      <div style={{width: '100vw', overflowX: 'hidden'}}>
        <Head>
          <title>Auto diagnostic</title>
        </Head>
        <WebsiteLayout />
        <main>
          <Box
            sx={{
              bgcolor: 'background.paper',
              mt: {md: 8},
              mb: 10,
            }}>
            {typeof id === 'string' && (
              <AutoDiagnosticTunnel appointmentId={id} />
            )}
          </Box>
        </main>
      </div>
    </AutodiagProvider>
  );
};

export default AutoDiagnostic;
